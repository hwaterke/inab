import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import {NODE_ENV} from './constants/version'
import {catchNotFound, errorHandler, tokenErrorHandler} from './errorhandling'
import {validateToken} from './middlewares/validateToken'
import {accountRouter} from './routes/accounts'
import {authRouter} from './routes/auth'
import {budgetItemRouter} from './routes/budgetItems'
import {categoryRouter} from './routes/categories'
import {categoryGroupRouter} from './routes/categoryGroups'
import {healthRouter} from './routes/health'
import {payeeRouter} from './routes/payees'
import {systemSettingRouter} from './routes/settings'
import {testingRouter} from './routes/testing'
import {transactionRouter} from './routes/transactions'

export const createExpressApp = () => {
  const app = express()

  app.use(helmet())

  if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'))
  }

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
  app.use('/category-groups', validateToken, categoryGroupRouter())
  app.use('/categories', validateToken, categoryRouter())
  app.use('/payees', validateToken, payeeRouter())
  app.use('/budget-items', validateToken, budgetItemRouter())
  app.use('/transactions', validateToken, transactionRouter())

  app.use('/settings', systemSettingRouter())

  if (NODE_ENV !== 'production') {
    app.use('/testing', testingRouter())
  }

  // Error handling
  app.use(catchNotFound)
  app.use(tokenErrorHandler)
  app.use(errorHandler)

  return app
}
