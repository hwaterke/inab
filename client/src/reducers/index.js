import merge from 'lodash/merge';
import without from 'lodash/without';
import * as types from '../actions/types';

// State structure proposal
const initialState = {
  selectedTransactions: [],
  entities: {
    transactions: {}
  }
};

export default function transactionReducer(state = initialState, action) {
  switch (action.type) {
  case types.ADD_TRANSACTION:
    return merge({}, state, {
      entities: {
        transactions: {
          [action.id]: {
            id: action.id,
            date: action.date,
            payee: action.payee,
            category: action.category,
            description: action.description,
            amount: action.amount
          }
        }
      }
    });
  case types.SELECT_TRANSACTION:
    if (state.selectedTransactions.includes(action.id)) {
      const noSelect = Object.assign({}, state, {selectedTransactions:[]});
      return merge(noSelect, {selectedTransactions: without(state.selectedTransactions, action.id)});
    }
    return merge({}, state, {selectedTransactions: state.selectedTransactions.concat(action.id)});
  default:
    return state;
  }
}
