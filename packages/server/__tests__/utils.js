import request from 'supertest'
import {createConnection, getConnection} from 'typeorm'
import {createExpressApp} from '../src/app'
import {databaseConfig} from '../src/database/config'
import {USER} from './data'

export const UUID_REGEX =
  /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/

/**
 * Resets the database before each test
 */
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

/**
 * Creates a user in the database before each test
 */
export const initializeUsersBeforeEach = (appRequest) => {
  let token

  beforeEach(async () => {
    // Register user
    const response = await appRequest()
      .post('/auth/register')
      .send(USER)
      .expect(201)
      .expect('Authorization', /^Bearer /)
      .expect(({body, headers: {authorization}}) => {
        expect(body.uuid).toMatch(UUID_REGEX)
        expect(body.email).toBe(USER.email)
        expect(body.password).toBe(undefined)
        expect(authorization).toMatch(/^Bearer /)
      })

    token = response.headers.authorization
  })

  return {
    getToken: () => token,
  }
}
