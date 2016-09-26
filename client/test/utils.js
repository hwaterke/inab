import reduxCrud from 'redux-crud';

export const selectMonth = (store, year, month) => store.dispatch({type: "@@redux-ui/MASS_UPDATE_UI_STATE", payload: {transforms: {year: year, month: month}, uiVars: {year: ["budget"], month: ["budget"]}}});

export const createAccount = (store, id, name) => store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: id, name: name}));

export const createCategory = (store, id, name) => store.dispatch(reduxCrud.actionCreatorsFor('categories').createSuccess({id: id, name: name}));

export const createBudgetItem = (store, id, month, category_id, amount) => store.dispatch(reduxCrud.actionCreatorsFor('budget_items').createSuccess({id: id, month: month, category_id: category_id, amount: amount}));

export const createInflowTBB = (store, id, account_id, amount, date) => store.dispatch(reduxCrud.actionCreatorsFor('transactions').createSuccess({
  id: id,
  account_id: account_id,
  amount: amount,
  category_id: null,
  date: date,
  description: null,
  payee: "Payee",
  transfer_account_id: null,
  type: "to_be_budgeted"
}));

export const createOutflow = (store, id, account_id, amount, category_id, date) => store.dispatch(reduxCrud.actionCreatorsFor('transactions').createSuccess({
  id: id,
  account_id: account_id,
  amount: amount,
  category_id: category_id,
  date: date,
  description: null,
  payee: "Payee",
  transfer_account_id: null,
  type: "regular"
}));

export const createTransfer = (store, id, account_id, transfer_account_id, amount, date) => store.dispatch(reduxCrud.actionCreatorsFor('transactions').createSuccess({
  id: id,
  account_id: account_id,
  amount: amount,
  category_id: null,
  date: date,
  description: null,
  payee: null,
  transfer_account_id: transfer_account_id,
  type: "regular"
}));
