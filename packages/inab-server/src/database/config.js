import {Account} from './entities/Account'
import {Category} from './entities/Category'
import {CategoryGroup} from './entities/CategoryGroup'
import {Location} from './entities/Location'
import {Payee} from './entities/Payee'
import {User} from './entities/User'

const entities = [Account, Category, CategoryGroup, Location, Payee, User]

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
