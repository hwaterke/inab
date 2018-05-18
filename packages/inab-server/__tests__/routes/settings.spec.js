import {initializeDatabaseBeforeEach, initializeUsersBeforeEach} from '../utils'

describe('settings', () => {
  const request = initializeDatabaseBeforeEach()
  const token = initializeUsersBeforeEach(request)

  it('should get a empty setting', async () => {
    await request()
      .get('/settings/foo')
      .set('Authorization', token.getToken())
      .expect(200)
      .expect(({body}) => {
        expect(body).toEqual(null)
      })
  })

  it('should write and read setting', async () => {
    await request()
      .post('/settings/foo')
      .set('Authorization', token.getToken())
      .send({value: 'Hello'})
      .expect(200)
      .expect(({body}) => {
        expect(body.name).toBe('foo')
        expect(body.value).toBe('Hello')
      })

    await request()
      .get('/settings/foo')
      .set('Authorization', token.getToken())
      .expect(200)
      .expect(({body}) => {
        expect(body.name).toBe('foo')
        expect(body.value).toBe('Hello')
      })
  })
})
