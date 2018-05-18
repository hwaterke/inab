import {Account} from './entities/Account'
import {BudgetItem} from './entities/BudgetItem'
import {Category} from './entities/Category'
import {CategoryGroup} from './entities/CategoryGroup'
import {Location} from './entities/Location'
import {Payee} from './entities/Payee'
import {Subtransaction} from './entities/Subtransaction'
import {SystemSetting} from './entities/SystemSetting'
import {Transaction} from './entities/Transaction'
import {TransactionTag} from './entities/TransactionTag'
import {User} from './entities/User'

const entities = [
  Account,
  Category,
  CategoryGroup,
  BudgetItem,
  Location,
  Payee,
  User,
  Subtransaction,
  Transaction,
  TransactionTag,
  SystemSetting,
]

const configs = {
  development: {
    type: 'sqlite',
    database: ':memory:',
    entities: entities,
    logging: true,
    synchronize: true,
  },
  test: {
    type: 'sqlite',
    database: ':memory:',
    entities: entities,
    logging: false,
    synchronize: true,
  },
  production: {
    type: 'sqlite',
    database: process.env.DATABASE_FILE,
    entities: entities,
    logging: false,
    synchronize: true,
  },
}

const env = process.env.NODE_ENV || 'development'
export const databaseConfig = configs[env]
