import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import {
  credentialsReducer,
  resourcesActivityReducer,
  resourcesReducer,
  selectedMonthReducer,
} from 'inab-shared'

export const rootReducer = combineReducers({
  resources: resourcesReducer,
  resourcesActivity: resourcesActivityReducer,
  credentials: credentialsReducer,
  selectedMonth: selectedMonthReducer,
  form: formReducer,
})
