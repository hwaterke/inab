import {Injectable} from '@nestjs/common'
import {BankTransaction} from './entities/bank-transaction.entities'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

@Injectable()
export class BankTransactionService {
  constructor(
    @InjectRepository(BankTransaction)
    private transactionRepository: Repository<BankTransaction>
  ) {}
}
