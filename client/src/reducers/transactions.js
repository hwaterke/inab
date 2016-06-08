import reduxCrud from 'redux-crud';
export default reduxCrud.reducersFor('transactions', {store: reduxCrud.STORE_IMMUTABLE});

export const getTransactions = state => state.transactions;
