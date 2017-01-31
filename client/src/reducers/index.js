import {combineReducers} from 'redux';
import errorsReducer from './errors';
import {reducer as formReducer} from 'redux-form';
import {reducer as uiReducer} from 'redux-ui';
import {routerReducer} from 'react-router-redux';
import reduxCrud from 'redux-crud';
import {transactionFiltersReducer} from './filters';

function selectedAccountReducer(state = null, action) {
  switch (action.type) {
    case "@@router/LOCATION_CHANGE": {
      let result = action.payload.pathname.match(/^\/account\/(\d+)$/i);
      if (result) {
        return Number.parseInt(result[1]);
      }
      return null;
    }
  }
  return state;
}

export default combineReducers({
  selectedAccount: selectedAccountReducer,
  transactions: reduxCrud.reducersFor('transactions'),
  accounts: reduxCrud.reducersFor('accounts'),
  categories: reduxCrud.reducersFor('categories'),
  categoryGroups: reduxCrud.reducersFor('category_groups'),
  budgetItems: reduxCrud.reducersFor('budget_items'),
  form: formReducer,
  ui: uiReducer,
  routing: routerReducer,
  errors: errorsReducer,
  transactionFilters: transactionFiltersReducer
});
