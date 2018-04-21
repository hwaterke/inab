import {combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import {resourcesReducer, selectedMonthReducer} from 'inab-shared'
import {credentialsReducer} from './credentials'

export const rootReducer = combineReducers({
  credentials: credentialsReducer,
  selectedMonth: selectedMonthReducer,
  resources: resourcesReducer,
  form: formReducer,
})
