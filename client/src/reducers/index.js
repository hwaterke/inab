import { combineReducers } from 'redux';
import transactionsReducers from './transactions';
import {reducer as formReducer} from 'redux-form';
import Immutable from 'immutable';
import * as types from '../actions/types';

function selectedPageReducer(state = 'BUDGET', action) {
  switch (action.type) {
    case types.SELECT_PAGE:
      return action.page;
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
  form: formReducer
});
