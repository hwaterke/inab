import {Module} from '@nestjs/common'
import {BankTransactionService} from './bank-transaction.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {BankTransaction} from './entities/bank-transaction.entities'
import {BankTransactionsResolver} from './bank-transactions.resolver'
import {BankTransactionItem} from './entities/bank-transaction-item.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BankTransaction, BankTransactionItem])],
  providers: [BankTransactionService, BankTransactionsResolver],
  exports: [BankTransactionService],
})
export class BankTransactionsModule {}
