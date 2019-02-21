import {
  credentialsReducer,
  resourcesActivityReducer,
  resourcesReducer,
  selectedMonthReducer,
} from '@inab/shared'
import {reducer as uiReducer} from 'redux-ui'
import errorsReducer from './errors'
import {transactionFiltersReducer} from './filters'
import {importReducer} from './import'

export const reducers = {
  resources: resourcesReducer,
  resourcesActivity: resourcesActivityReducer,
  selectedMonth: selectedMonthReducer,
  ui: uiReducer,
  errors: errorsReducer,
  transactionFilters: transactionFiltersReducer,
  credentials: credentialsReducer,
  imported: importReducer,
}
