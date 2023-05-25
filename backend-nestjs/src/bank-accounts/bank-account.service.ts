import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {BankAccount} from './entities/bank-account.entity'

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

  async upsert(payload: {name: string; iban: string}) {
    const existingBankAccount = await this.bankAccountRepository.findOne({
      where: {
        iban: payload.iban,
      },
    })

    if (existingBankAccount) {
      return await this.update(existingBankAccount.uuid, payload)
    }

    return await this.create(payload)
  }

  async create(payload: {name: string; iban: string}) {
    return await this.bankAccountRepository.save({
      name: payload.name.trim(),
      iban: payload.iban.toUpperCase().trim(),
    })
  }

  async update(uuid: string, payload: {name: string; iban: string}) {
    return await this.bankAccountRepository.update(uuid, {
      name: payload.name.trim(),
      iban: payload.iban.toUpperCase().trim(),
    })
  }

  async remove(uuid: string) {
    await this.bankAccountRepository.delete(uuid)
  }
}
