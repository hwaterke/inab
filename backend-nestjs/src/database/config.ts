import type {SqliteConnectionOptions} from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import {BankAccount} from '../bank-accounts/entities/bank-account.entity'
import {Category} from '../categories/entities/category.entity'
import {CategoryGroup} from '../categories/entities/category-group.entity'
import {Payee} from '../payees/entities/payee.entity'
import {BankTransaction} from '../transactions/entities/bank-transaction.entities'
import {BankTransactionItem} from '../transactions/entities/bank-transaction-item.entity'
import {PayeeMigration1684177974701} from './migrations/1684177974701-PayeeMigration'
import {CategoryMigration1684178212867} from './migrations/1684178212867-CategoryMigration'
import {AccountMigration1684178437639} from './migrations/1684178437639-AccountMigration'
import {TransactionMigration1684495931256} from './migrations/1684495931256-TransactionMigration'
import {TransactionItemMigration1684872625977} from './migrations/1684872625977-TransactionItemMigration'

export const DatabaseConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: process.env.DATABASE_PATH ?? 'inab.sqlite',
  entities: [
    BankAccount,
    Category,
    CategoryGroup,
    Payee,
    BankTransaction,
    BankTransactionItem,
  ],
  migrations: [
    PayeeMigration1684177974701,
    CategoryMigration1684178212867,
    AccountMigration1684178437639,
    TransactionMigration1684495931256,
    TransactionItemMigration1684872625977,
  ],
  migrationsRun: true,
  synchronize: false,
  logging: false,
}
