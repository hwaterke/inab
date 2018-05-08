import {
  credentialsReducer,
  resourcesActivityReducer,
  resourcesReducer,
  selectedMonthReducer,
} from 'inab-shared'
import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import {reducer as uiReducer} from 'redux-ui'
import errorsReducer from './errors'
import {transactionFiltersReducer} from './filters'

export default combineReducers({
  resources: resourcesReducer,
  resourcesActivity: resourcesActivityReducer,
  selectedMonth: selectedMonthReducer,
  form: formReducer,
  ui: uiReducer,
  errors: errorsReducer,
  transactionFilters: transactionFiltersReducer,
  credentials: credentialsReducer,
})
