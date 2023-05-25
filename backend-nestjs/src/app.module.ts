import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CategoriesModule} from './categories/categories.module'
import {BankTransactionsModule} from './transactions/bank-transactions.module'
import {PayeesModule} from './payees/payees.module'
import {BankAccountsModule} from './bank-accounts/bank-accounts.module'
import {DatabaseConfig} from './database/config'
import {GraphQLModule} from '@nestjs/graphql'
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo'
import {join} from 'path'
import {FileImportModule} from './file-import/file-import.module'
import {ConfigModule} from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(DatabaseConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    CategoriesModule,
    PayeesModule,
    BankTransactionsModule,
    BankAccountsModule,
    FileImportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
