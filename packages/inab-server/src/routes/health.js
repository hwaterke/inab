import expressPromiseRouter from 'express-promise-router'

const pong = (req, res) => res.json({message: 'pong'})

export const healthRouter = () => {
  const router = expressPromiseRouter()

  router.get('/ping', pong)

  return router
}
