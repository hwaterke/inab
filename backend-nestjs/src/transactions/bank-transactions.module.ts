import {Module} from '@nestjs/common'
import {BankTransactionService} from './bank-transaction.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {BankTransaction} from './entities/bank-transaction.entities'
import {BankTransactionsResolver} from './bank-transactions.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([BankTransaction])],
  providers: [BankTransactionService, BankTransactionsResolver],
})
export class BankTransactionsModule {}
