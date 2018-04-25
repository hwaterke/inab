import {AccountResource} from '../entities/Account'
import {CategoryResource} from '../entities/Category'
import {CategoryGroupResource} from '../entities/CategoryGroup'
import {BudgetItemResource} from '../entities/BudgetItem'
import {PayeeResource} from '../entities/Payee'
import {TransactionResource} from '../entities/Transaction'
import {
  createActivityReducersForResources,
  createReducersForResources,
} from 'redux-crud-provider'

const resources = [
  AccountResource,
  CategoryResource,
  CategoryGroupResource,
  BudgetItemResource,
  PayeeResource,
  TransactionResource,
]

export const resourcesReducer = createReducersForResources(resources)

export const resourcesActivityReducer = createActivityReducersForResources(
  resources
)
