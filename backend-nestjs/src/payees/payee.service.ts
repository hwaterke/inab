import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {Payee} from './entities/payee.entity'

@Injectable()
export class PayeeService {
  constructor(
    @InjectRepository(Payee)
    private payeeRepository: Repository<Payee>
  ) {}

  async create(payload: {name: string}) {
    return await this.payeeRepository.save(payload)
  }

  async findAll() {
    return await this.payeeRepository.find()
  }

  async findOne(uuid: string) {
    return await this.payeeRepository.findOneBy({uuid})
  }

  async update(uuid: string, payload: {name: string}) {
    return await this.payeeRepository.update(uuid, payload)
  }

  async remove(uuid: string) {
    await this.payeeRepository.delete(uuid)
  }
}
