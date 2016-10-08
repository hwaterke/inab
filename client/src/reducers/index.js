import { combineReducers } from 'redux';
import transactionsReducers from './transactions';
import accountsReducers from './accounts';
import categoriesReducers from './categories';
import categoryGroupsReducers from './categoryGroups';
import budgetItemsReducers from './budgetItems';
import {reducer as formReducer} from 'redux-form';
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

export default combineReducers({
  selectedPage: selectedPageReducer,
  transactions: transactionsReducers,
  accounts: accountsReducers,
  categories: categoriesReducers,
  categoryGroups: categoryGroupsReducers,
  budgetItems: budgetItemsReducers,
  form: formReducer,
  modals: modalReducer,
  ui: uiReducer
});
