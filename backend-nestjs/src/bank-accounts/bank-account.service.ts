import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {BankAccount} from './entities/bank-account.entity'

function cleanIBAN(iban: string) {
  return iban.toUpperCase().trim()
}

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepository: Repository<BankAccount>
  ) {}

  async findAll() {
    return await this.bankAccountRepository.find({
      order: {
        name: 'ASC',
      },
    })
  }

  async findOne(uuid: string) {
    return await this.bankAccountRepository.findOneBy({uuid})
  }

  async findOneByIban(iban: string) {
    return await this.bankAccountRepository
      .createQueryBuilder('bankAccount')
      .where("REPLACE(bankAccount.iban, ' ', '') = :iban", {
        iban: cleanIBAN(iban).replace(/\s/g, ''),
      })
      .getOne()
  }

  async findOneByIbanEndingWith(text: string) {
    return await this.bankAccountRepository
      .createQueryBuilder('bankAccount')
      .where("REPLACE(bankAccount.iban, ' ', '') LIKE :iban", {
        iban: `%${cleanIBAN(text).replace(/\s/g, '')}`,
      })
      .getOne()
  }

  async upsert(payload: {name: string; iban: string}) {
    const iban = cleanIBAN(payload.iban)

    const existingBankAccount = await this.bankAccountRepository.findOne({
      where: {
        iban,
      },
    })

    if (existingBankAccount) {
      if (existingBankAccount.name !== payload.name) {
        return await this.update(existingBankAccount.uuid, payload)
      }
    } else {
      return await this.create(payload)
    }
  }

  async create(payload: {name: string; iban: string}) {
    return await this.bankAccountRepository.save({
      name: payload.name.trim(),
      iban: cleanIBAN(payload.iban),
    })
  }

  async update(uuid: string, payload: {name: string; iban: string}) {
    return await this.bankAccountRepository.update(uuid, {
      name: payload.name.trim(),
      iban: cleanIBAN(payload.iban),
    })
  }

  async remove(uuid: string) {
    await this.bankAccountRepository.delete(uuid)
  }
}
