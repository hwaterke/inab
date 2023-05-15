import {DataSource} from 'typeorm'
import {DatabaseConfig} from '../../src/database/config'

export const datasource = new DataSource({
  ...DatabaseConfig,
  database: 'migration.sqlite',
  logging: true,
})
