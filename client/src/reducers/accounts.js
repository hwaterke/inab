import reduxCrud from 'redux-crud';
export default reduxCrud.reducersFor('accounts', {store: reduxCrud.STORE_MUTABLE});

export const getAccounts = state => state.accounts;
