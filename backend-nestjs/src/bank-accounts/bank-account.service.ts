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

  async create(payload: {name: string; iban: string | null}) {
    return await this.bankAccountRepository.save(payload)
  }

  async findAll() {
    return await this.bankAccountRepository.find()
  }

  async findOne(uuid: string) {
    return await this.bankAccountRepository.findOneBy({uuid})
  }

  async update(uuid: string, payload: {name: string; iban: string | null}) {
    return await this.bankAccountRepository.update(uuid, payload)
  }

  async remove(uuid: string) {
    await this.bankAccountRepository.delete(uuid)
  }
}
