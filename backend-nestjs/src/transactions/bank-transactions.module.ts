import {Module} from '@nestjs/common'
import {BankTransactionService} from './bank-transaction.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {BankTransaction} from './entities/bank-transaction.entities'

@Module({
  imports: [TypeOrmModule.forFeature([BankTransaction])],
  providers: [BankTransactionService],
})
export class BankTransactionsModule {}
