import {PAYEE} from '../data'
import {initializeDatabaseBeforeEach, initializeUsersBeforeEach, UUID_REGEX,} from '../utils'

describe('payees', () => {
  const request = initializeDatabaseBeforeEach()
  const token = initializeUsersBeforeEach(request)

  it('should get all payees', async () => {
    await request()
      .get('/payees')
      .set('Authorization', token.getToken())
      .expect(200)
      .expect(({body}) => {
        expect(body).toEqual([])
      })
  })

  it('should not create a payee without a name', async () => {
    await request()
      .post('/payees')
      .set('Authorization', token.getToken())
      .send({
        ...PAYEE,
        name: undefined,
      })
      .expect(400)
  })

  it('should not create a payee without a locations array', async () => {
    await request()
      .post('/payees')
      .set('Authorization', token.getToken())
      .send({
        ...PAYEE,
        locations: undefined,
      })
      .expect(400)
  })

  it('should create a payee without any locations', async () => {
    await request()
      .post('/payees')
      .set('Authorization', token.getToken())
      .send(PAYEE)
      .expect(201)
      .expect(({body}) => {
        expect(body.uuid).toMatch(UUID_REGEX)
        expect(body.name).toBe(PAYEE.name)
        expect(body.locations).toEqual(PAYEE.locations)
      })
  })

  it('should create, update and delete a payee with locations', async () => {
    const payee = await request()
      .post('/payees')
      .set('Authorization', token.getToken())
      .send({
        ...PAYEE,
        locations: [
          {
            latitude: 10.1,
            longitude: 10.2,
          },
        ],
      })
      .expect(201)
      .expect(({body}) => {
        expect(body.uuid).toMatch(UUID_REGEX)
        expect(body.name).toBe(PAYEE.name)
        expect(Array.isArray(body.locations)).toBe(true)
        expect(body.locations.length).toBe(1)
      })

    await request()
      .patch(`/payees/${payee.body.uuid}`)
      .set('Authorization', token.getToken())
      .send({
        name: 'New name',
        locations: [
          {
            latitude: 11.1,
            longitude: 11.2,
          },
        ],
      })
      .expect(200)
      .expect(({body}) => {
        expect(body.uuid).toMatch(UUID_REGEX)
        expect(body.name).toBe("New name")
        expect(Array.isArray(body.locations)).toBe(true)
        expect(body.locations.length).toBe(1)
        expect(body.locations[0].latitude).toEqual(11.1)
        expect(body.locations[0].longitude).toEqual(11.2)
      })

    await request()
      .delete(`/payees/${payee.body.uuid}`)
      .set('Authorization', token.getToken())
      .expect(204)
  })
})
