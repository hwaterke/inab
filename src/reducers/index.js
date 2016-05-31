import merge from 'lodash/merge';

// State structure proposal
const initialState = {
  entities: {
    transactions: {}
  }
};

export default function transactionReducer(state = initialState, action) {
  switch (action.type) {
  case 'ADD_TRANSACTION':
    var t = {
      id: action.id,
      date: action.date,
      payee: action.payee,
      category: action.category,
      description: action.description,
      amount: action.amount
    };
    var ne = {entities: {transactions: {}}};
    ne["entities"]["transactions"][action.id] = t;
    return merge({}, state, ne);
  default:
    return state;
  }
}
