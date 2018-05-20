import expressPromiseRouter from 'express-promise-router'
import {NODE_ENV, VERSION} from '../constants/version'

const pong = (req, res) => res.json({message: 'pong'})

const version = (req, res) =>
  res.json({version: VERSION, environment: NODE_ENV})

export const healthRouter = () => {
  const router = expressPromiseRouter()

  router.get('/ping', pong)

  router.get('/version', version)

  return router
}
