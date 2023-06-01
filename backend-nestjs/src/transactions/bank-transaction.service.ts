import {Injectable} from '@nestjs/common'
import {BankTransaction} from './entities/bank-transaction.entities'
import {InjectRepository} from '@nestjs/typeorm'
import {Not, Repository} from 'typeorm'
import {BankTransactionItemInputType} from './models/bank-transaction.model'
import {BankTransactionItem} from './entities/bank-transaction-item.entity'
import {isNil} from 'remeda'

@Injectable()
export class BankTransactionService {
  constructor(
    @InjectRepository(BankTransaction)
    private transactionRepository: Repository<BankTransaction>,
    @InjectRepository(BankTransactionItem)
    private transactionItemRepository: Repository<BankTransactionItem>
  ) {}

  async findAll({
    page,
    pageSize,
    bankAccounts,
  }: {
    page: number
    pageSize: number
    bankAccounts: string[] | null
  }) {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoinAndSelect('transaction.bankAccount', 'bankAccount')
      .leftJoinAndSelect(
        'transaction.transferBankAccount',
        'transferBankAccount'
      )
      .leftJoinAndSelect('transaction.payee', 'payee')
      .leftJoinAndSelect('transaction.items', 'items')
      .leftJoinAndSelect('items.category', 'category')
      .leftJoinAndSelect('items.reimburse', 'reimburse')
      .orderBy('transaction.date', 'DESC')
      .take(pageSize)
      .skip(((page < 1 ? 1 : page) - 1) * pageSize)

    if (!isNil(bankAccounts)) {
      query
        .where('bankAccount.uuid IN (:...bankAccounts)', {bankAccounts})
        .orWhere('transferBankAccount.uuid IN (:...bankAccounts)', {
          bankAccounts,
        })
    }

    const result = await query.getManyAndCount()

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

  async hashAlreadyExists(bankAccountUuid: string, hash: string) {
    const count = await this.transactionRepository.countBy({
      hash,
      bankAccountUuid,
    })
    return count > 0
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

  async create(payload: {
    date: string
    time: string | null
    amount: number
    bankAccountUuid: string
    beneficiaryAccountNumber: string | null
    hash: string | null
    importDetails: string | null
    transferBankAccountUuid: string | null
  }) {
    return this.transactionRepository.save(
      this.transactionRepository.create(payload)
    )
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
