import {combineReducers} from 'redux';
import errorsReducer from './errors';
import {reducer as formReducer} from 'redux-form';
import {reducer as uiReducer} from 'redux-ui';
import {transactionFiltersReducer} from './filters';
import {credentialsReducer} from './credentials';
import {resourcesReducer, selectedMonthReducer} from 'inab-shared';

export default combineReducers({
  resources: resourcesReducer,
  selectedMonth: selectedMonthReducer,
  form: formReducer,
  ui: uiReducer,
  errors: errorsReducer,
  transactionFilters: transactionFiltersReducer,
  credentials: credentialsReducer
});
