import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import {catchNotFound, errorHandler} from './errorhandling'
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

  // Error handling
  app.use(catchNotFound)
  app.use(errorHandler)

  return app
}
