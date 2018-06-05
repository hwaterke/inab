import {TRANSACTION} from '../data'
import {
  initializeDatabaseBeforeEach,
  initializeUsersBeforeEach,
  UUID_REGEX,
} from '../utils'

describe('transactions', () => {
  const request = initializeDatabaseBeforeEach()
  const token = initializeUsersBeforeEach(request)

  it('should get all transactions', async () => {
    await request()
      .get('/transactions')
      .set('Authorization', token.getToken())
      .expect(200)
      .expect(({body}) => {
        expect(body).toEqual([])
      })
  })

  it('should create a transaction', async () => {
    const account = await request()
      .post('/accounts')
      .set('Authorization', token.getToken())
      .send({name: 'Checking Account'})
      .expect(201)
      .expect(({body}) => {
        expect(body.uuid).toMatch(UUID_REGEX)
        expect(body.name).toBe('Checking Account')
      })

    await request()
      .post('/transactions')
      .set('Authorization', token.getToken())
      .send({
        ...TRANSACTION,
        account_uuid: account.body.uuid,
      })
      .expect(({body}) => {
        expect(body.uuid).toMatch(UUID_REGEX)
      })
  })
})
