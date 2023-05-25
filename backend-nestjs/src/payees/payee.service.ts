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

  async findAll() {
    return await this.payeeRepository.find({
      order: {
        name: 'ASC',
      },
    })
  }

  async findOne(uuid: string) {
    return await this.payeeRepository.findOneBy({uuid})
  }

  async upsert(payload: {name: string}) {
    const existingPayee = await this.payeeRepository.findOne({
      where: {
        name: payload.name,
      },
    })

    if (!existingPayee) {
      return await this.create(payload)
    }

    return existingPayee
  }

  async create(payload: {name: string}) {
    return await this.payeeRepository.save(payload)
  }

  async update(uuid: string, payload: {name: string}) {
    return await this.payeeRepository.update(uuid, payload)
  }

  async remove(uuid: string) {
    await this.payeeRepository.delete(uuid)
  }
}
