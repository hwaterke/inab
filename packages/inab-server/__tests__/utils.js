import request from 'supertest'
import {createConnection, getConnection} from 'typeorm'
import {createExpressApp} from '../src/app'
import {databaseConfig} from '../src/database/config'

export const initializeDatabaseBeforeEach = (resetBeforeEach = true) => {
  let supertest

  beforeAll(() => {
    return createConnection(databaseConfig)
      .then(() => getConnection().synchronize(true))
      .then(() => {
        const app = createExpressApp()
        supertest = request(app)
      })
  })

  if (resetBeforeEach) {
    beforeEach(() => {
      return getConnection().synchronize(true)
    })
  }

  afterAll(() => {
    const connection = getConnection()
    return connection.isConnected ? connection.close() : undefined
  })

  return () => supertest
}
