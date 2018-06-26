import {
  credentialsReducer,
  resourcesActivityReducer,
  resourcesReducer,
  selectedMonthReducer,
} from '@inab/shared'
import {reducer as uiReducer} from 'redux-ui'
import errorsReducer from './errors'
import {transactionFiltersReducer} from './filters'

export const reducers = {
  resources: resourcesReducer,
  resourcesActivity: resourcesActivityReducer,
  selectedMonth: selectedMonthReducer,
  ui: uiReducer,
  errors: errorsReducer,
  transactionFilters: transactionFiltersReducer,
  credentials: credentialsReducer,
}
