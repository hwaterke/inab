// State structure proposal

const initialState = {
  entities: {
    transactions: {
      1: {
        id: 1,
        amount: 33.2
      }
    }
  }
};

function transactionReducer(state = initialState, action) {
  return state;
}

export default transactionReducer;
