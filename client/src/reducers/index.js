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

function selectedAccountReducer(state = null, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
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
  transactions: reduxCrud.reducersFor(TransactionResource.path),
  accounts: reduxCrud.reducersFor(AccountResource.path),
  categories: reduxCrud.reducersFor(CategoryResource.path),
  categoryGroups: reduxCrud.reducersFor(CategoryGroupResource.path),
  budgetItems: reduxCrud.reducersFor(BudgetItemResource.path),
  form: formReducer,
  ui: uiReducer,
  routing: routerReducer,
  errors: errorsReducer,
  transactionFilters: transactionFiltersReducer
});
