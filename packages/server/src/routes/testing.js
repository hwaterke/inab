import expressPromiseRouter from 'express-promise-router'
import {getConnection} from 'typeorm/index'

export const testingRouter = () => {
  const router = expressPromiseRouter()

  router.get('/reset-db', async (req, res) => {
    await getConnection().synchronize(true)
    res.json({message: 'ok'})
  })

  return router
}
