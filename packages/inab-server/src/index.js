import {createConnection} from 'typeorm'
import {databaseConfig} from './database/config'

createConnection(databaseConfig).then(() => {
  // eslint-disable-next-line no-console
  console.log('Hello World')
})
