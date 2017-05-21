import {combineReducers} from 'redux';
import errorsReducer from './errors';
import {reducer as formReducer} from 'redux-form';
import {reducer as uiReducer} from 'redux-ui';
import {routerReducer} from 'react-router-redux';
import {transactionFiltersReducer} from './filters';
import {credentialsReducer} from './credentials';
import {resourcesReducer, selectedMonthReducer} from 'inab-shared';

function selectedAccountReducer(state = null, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      let result = action.payload.pathname.match(/^\/account\/([A-Za-z0-9_-]+)$/i);
      if (result) {
        return result[1];
      }
      return null;
    }
  }
  return state;
}

export default combineReducers({
  resources: resourcesReducer,
  selectedAccount: selectedAccountReducer,
  selectedMonth: selectedMonthReducer,
  form: formReducer,
  ui: uiReducer,
  routing: routerReducer,
  errors: errorsReducer,
  transactionFilters: transactionFiltersReducer,
  credentials: credentialsReducer
});
