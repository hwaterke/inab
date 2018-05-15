import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import {catchNotFound, errorHandler, tokenErrorHandler} from './errorhandling'
import {validateToken} from './middlewares/validateToken'
import {accountRouter} from './routes/accounts'
import {authRouter} from './routes/auth'
import {healthRouter} from './routes/health'

export const createExpressApp = () => {
  const app = express()

  app.use(helmet())
  app.use(logger('dev'))
  app.use(
    cors({
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Authorization'],
    })
  )
  app.use(express.json())

  // Routes
  app.use('/health', healthRouter())
  app.use('/auth', authRouter())

  app.use('/accounts', validateToken, accountRouter())

  // Error handling
  app.use(catchNotFound)
  app.use(tokenErrorHandler)
  app.use(errorHandler)

  return app
}
