import { combineReducers } from 'redux';
import transactionsReducers from './transactions';
import accountsReducers from './accounts';
import categoriesReducers from './categories';
import categoryGroupsReducers from './categoryGroups';
import {reducer as formReducer} from 'redux-form';
import Immutable from 'immutable';
import * as types from '../actions/types';
import {reducer as modalReducer} from 'react-redux-modal';
import { reducer as uiReducer } from 'redux-ui';

function selectedPageReducer(state = {name: 'BUDGET'}, action) {
  switch (action.type) {
    case types.SELECT_PAGE:
      return {
        name: action.name,
        data: action.data
      };
    default:
      return state;
  }
}

function selectedTransactionsReducer(state = Immutable.Set(), action) {
  switch (action.type) {
    case types.SELECT_TRANSACTION:
      if (state.includes(action.id)) {
        return state.delete(action.id);
      }
      return state.add(action.id);
    default:
      return state;
  }
}

export default combineReducers({
  selectedPage: selectedPageReducer,
  selectedTransactions: selectedTransactionsReducer,
  transactions: transactionsReducers,
  accounts: accountsReducers,
  categories: categoriesReducers,
  categoryGroups: categoryGroupsReducers,
  form: formReducer,
  modals: modalReducer,
  ui: uiReducer
});
