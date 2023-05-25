import {Injectable} from '@nestjs/common'
import {BankTransaction} from './entities/bank-transaction.entities'
import {InjectRepository} from '@nestjs/typeorm'
import {Not, Repository} from 'typeorm'
import * as XLSX from 'xlsx'
import {BankTransactionItemInputType} from './models/bank-transaction.model'
import {BankTransactionItem} from './entities/bank-transaction-item.entity'

/*
TODO
- Extract better date from comment
- Auto category and payee
- Auto account transfer
 */

enum ING_HEADERS {
  ACCOUNT_NUMBER = 'Numéro de compte',
  ACCOUNT_NAME = 'Nom du compte',
  BENEFICIARY_ACCOUNT = 'Compte partie adverse',
  MOVEMENT_NUMBER = 'Numéro de mouvement',
  POSTING_DATE = 'Date comptable',
  VALUE_DATE = 'Date valeur',
  AMOUNT = 'Montant',
  CURRENCY = 'Devise',
  LABELS = 'Libellés',
  DETAILS = 'Détails du mouvement',
  MESSAGE = 'Message',
}

const extractTime = (text: string | undefined | null): string | null => {
  if (!text) {
    return null
  }

  const match = text.match(/\d{2} - (\d{2}h\d{2})/)
  if (match) {
    return `${match[1].replace('h', ':')}:00`
  }

  const match2 = text.match(/\d{2}\/\d{2} - (\d{2}:\d{2}:\d{2})/)
  if (match2) {
    return match2[1]
  }

  const match3 = text.match(/\d{2}\/\d{2} (\d{2}:\d{2})/)
  if (match3) {
    return `${match3[1]}:00`
  }

  return null
}

@Injectable()
export class BankTransactionService {
  constructor(
    @InjectRepository(BankTransaction)
    private transactionRepository: Repository<BankTransaction>,
    @InjectRepository(BankTransactionItem)
    private transactionItemRepository: Repository<BankTransactionItem>
  ) {}

  async findAll({page, pageSize}: {page: number; pageSize: number}) {
    const result = await this.transactionRepository.findAndCount({
      relations: {
        bankAccount: true,
        payee: true,
        items: {
          category: true,
          reimburse: true,
        },
      },
      order: {
        date: 'DESC',
      },
      take: pageSize,
      skip: ((page < 1 ? 1 : page) - 1) * pageSize,
    })

    return {
      items: result[0],
      totalCount: result[1],
    }
  }

  async findOne(uuid: string) {
    return await this.transactionRepository.findOneOrFail({
      where: {
        uuid,
      },
      relations: {
        bankAccount: true,
        payee: true,
        items: {
          category: true,
          reimburse: {
            transaction: {
              bankAccount: true,
            },
            category: true,
          },
          reimbursedBy: {
            transaction: {
              bankAccount: true,
            },
            category: true,
          },
        },
      },
    })
  }

  setPayee({
    bankTransactionUuid,
    payeeUuid,
  }: {
    bankTransactionUuid: string
    payeeUuid: string | null
  }) {
    return this.transactionRepository.update(
      {uuid: bankTransactionUuid},
      {payeeUuid}
    )
  }

  async findAllItems() {
    return await this.transactionItemRepository.find({
      relations: {
        transaction: {
          payee: true,
        },
        category: true,
      },
    })
  }

  async addItem(
    bankTransactionUuid: string,
    item: BankTransactionItemInputType
  ) {
    await this.validateItem({
      itemPayload: item,
      bankTransactionUuid: bankTransactionUuid,
      bankTransactionItemUuid: null,
    })
    return await this.transactionItemRepository.save(
      this.transactionItemRepository.create({
        ...item,
        transactionUuid: bankTransactionUuid,
      })
    )
  }

  async updateItem(
    bankTransactionUuid: string,
    itemUuid: string,
    item: BankTransactionItemInputType
  ) {
    await this.validateItem({
      itemPayload: item,
      bankTransactionUuid: bankTransactionUuid,
      bankTransactionItemUuid: itemUuid,
    })
    return await this.transactionItemRepository.update(
      {uuid: itemUuid, transactionUuid: bankTransactionUuid},
      item
    )
  }

  async removeItem(bankTransactionUuid: string, itemUuid: string) {
    return await this.transactionItemRepository.delete({
      uuid: itemUuid,
      transactionUuid: bankTransactionUuid,
    })
  }

  async import({
    bankAccountUuid,
    file,
  }: {
    bankAccountUuid: string
    file: string
  }): Promise<void> {
    console.log('Importing transactions')

    const result = XLSX.readFile(file, {raw: true})

    const data: Record<string, string>[] = XLSX.utils.sheet_to_json(
      result.Sheets[result.SheetNames[0]],
      {
        blankrows: false,
        skipHidden: false,
      }
    )

    for (const row of data) {
      if (row[ING_HEADERS.AMOUNT] !== undefined) {
        const amount = parseInt(
          row[ING_HEADERS.AMOUNT].replace(/[,.]/g, ''),
          10
        )
        const date = row[ING_HEADERS.VALUE_DATE].replace(
          /(\d{2})\/(\d{2})\/(\d{4})/,
          '$3-$2-$1'
        )
        const hash = `ing-${row[ING_HEADERS.VALUE_DATE]}-${
          row[ING_HEADERS.MOVEMENT_NUMBER]
        }`

        if (amount !== 0) {
          if (row[ING_HEADERS.CURRENCY] !== 'EUR') {
            throw new Error('Currency not supported')
          }

          // Make sure no transaction exist with the same hash
          const existingTransaction = await this.transactionRepository.findOne({
            where: {
              hash,
            },
          })

          if (existingTransaction) {
            console.log(`Transaction ${hash} already exists, skipping`)
            continue
          }

          await this.transactionRepository.save(
            this.transactionRepository.create({
              bankAccountUuid,
              date,
              time:
                extractTime(row[ING_HEADERS.LABELS]) ??
                extractTime(row[ING_HEADERS.DETAILS]),
              amount,
              hash,
              importDetails: JSON.stringify({
                labels:
                  row[ING_HEADERS.LABELS]?.replace(/\s+/g, ' ').trim() ?? null,
                details:
                  row[ING_HEADERS.DETAILS]?.replace(/\s+/g, ' ').trim() ?? null,
              }),
            })
          )
        }
      }
    }
  }

  private async validateItem({
    itemPayload,
    bankTransactionUuid,
    bankTransactionItemUuid,
  }: {
    itemPayload: BankTransactionItemInputType
    bankTransactionUuid: string
    bankTransactionItemUuid: string | null
  }) {
    const transaction = await this.transactionRepository.findOneOrFail({
      where: {
        uuid: bankTransactionUuid,
      },
    })
    if (transaction.amount > 0 && itemPayload.amount < 0) {
      throw new Error('Cannot add negative item to a positive transaction')
    }
    if (transaction.amount < 0 && itemPayload.amount > 0) {
      throw new Error('Cannot add positive item to a negative transaction')
    }
    if (itemPayload.reimburseUuid) {
      // Get the item being reimbursed
      const reimbursedItem = await this.transactionItemRepository.findOneOrFail(
        {
          where: {
            uuid: itemPayload.reimburseUuid,
          },
        }
      )

      if (reimbursedItem.amount > 0) {
        // Only spending can be reimbursed
        throw new Error('Cannot reimburse a positive item')
      }

      const allReimbursement = await this.transactionItemRepository.find({
        where: {
          uuid: bankTransactionItemUuid
            ? Not(bankTransactionItemUuid)
            : undefined,
          reimburseUuid: itemPayload.reimburseUuid,
        },
      })

      // Sum of all the reimbursement in one line
      const sumReimbursement = allReimbursement.reduce((acc, item) => {
        return acc + item.amount
      }, 0)

      if (reimbursedItem.amount + sumReimbursement + itemPayload.amount > 0) {
        throw new Error(
          'Reimbursement amount cannot exceed amount being reimbursed'
        )
      }
    }
  }
}
