import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CategoriesModule} from './categories/categories.module'
import {Category} from './categories/entities/category.entity'
import {CategoryGroup} from './categories/entities/category-group.entity'
import {BankTransactionsModule} from './transactions/bank-transactions.module'
import {PayeesModule} from './payees/payees.module'
import {Payee} from './payees/entities/payee.entity'
import {BankTransaction} from './transactions/entities/bank-transaction.entities'
import {BankAccountsModule} from './bank-accounts/bank-accounts.module'
import {BankAccount} from './bank-accounts/entities/bank-account.entity'
import {BankSubTransaction} from './transactions/entities/bank-subtransaction.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [
        BankAccount,
        Category,
        CategoryGroup,
        Payee,
        BankTransaction,
        BankSubTransaction,
      ],
      synchronize: true,
      logging: true,
    }),
    CategoriesModule,
    PayeesModule,
    BankTransactionsModule,
    BankAccountsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
