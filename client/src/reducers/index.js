import { combineReducers } from 'redux';
import transactionsReducers from './transactions';
import Immutable from 'immutable';
import * as types from '../actions/types';

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
  selectedTransactions: selectedTransactionsReducer,
  transactions: transactionsReducers
});
