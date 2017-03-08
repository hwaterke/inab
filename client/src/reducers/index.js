import {combineReducers} from 'redux';
import errorsReducer from './errors';
import {reducer as formReducer} from 'redux-form';
import {reducer as uiReducer} from 'redux-ui';
import {routerReducer} from 'react-router-redux';
import reduxCrud from 'redux-crud';
import {transactionFiltersReducer} from './filters';
import {AccountResource} from '../entities/Account';
import {CategoryResource} from '../entities/Category';
import {CategoryGroupResource} from '../entities/CategoryGroup';
import {BudgetItemResource} from '../entities/BudgetItem';
import {TransactionResource} from '../entities/Transaction';
import {credentialsReducer} from './credentials';

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
  selectedAccount: selectedAccountReducer,
  transactions: reduxCrud.List.reducersFor(TransactionResource.path, {key: 'uuid'}),
  accounts: reduxCrud.List.reducersFor(AccountResource.path, {key: 'uuid'}),
  categories: reduxCrud.List.reducersFor(CategoryResource.path, {key: 'uuid'}),
  categoryGroups: reduxCrud.List.reducersFor(CategoryGroupResource.path, {key: 'uuid'}),
  budgetItems: reduxCrud.List.reducersFor(BudgetItemResource.path, {key: 'uuid'}),
  form: formReducer,
  ui: uiReducer,
  routing: routerReducer,
  errors: errorsReducer,
  transactionFilters: transactionFiltersReducer,
  credentials: credentialsReducer
});
