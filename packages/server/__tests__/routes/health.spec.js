import {initializeDatabaseBeforeEach} from '../utils'

describe('health', () => {
  const request = initializeDatabaseBeforeEach()

  it('should ping pong', async () => {
    await request()
      .get('/health/ping')
      .expect(200)
      .expect(({body}) => {
        expect(body.message).toBe('pong')
      })
  })
})
