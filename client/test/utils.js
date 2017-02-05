import reduxCrud from 'redux-crud';
import {AccountResource} from '../src/entities/Account';
import {CategoryResource} from '../src/entities/Category';
import {BudgetItemResource} from '../src/entities/BudgetItem';
import {TransactionResource} from '../src/entities/Transaction';

export const selectMonth = (store, year, month) => store.dispatch({
  type: '@@redux-ui/MASS_UPDATE_UI_STATE',
  payload: {transforms: {year: year, month: month}, uiVars: {year: ['budget'], month: ['budget']}}
});

export const createAccount = (store, id, name) => store.dispatch(reduxCrud.actionCreatorsFor(AccountResource.path).createSuccess({
  id: id,
  name: name
}));

export const createCategory = (store, id, name) => store.dispatch(reduxCrud.actionCreatorsFor(CategoryResource.path).createSuccess({
  id: id,
  name: name
}));

export const createBudgetItem = (store, id, month, category_id, amount) => store.dispatch(reduxCrud.actionCreatorsFor(BudgetItemResource.path).createSuccess({
  id: id,
  month: month,
  category_id: category_id,
  amount: amount
}));

export const createInflowTBB = (store, id, account_id, amount, date) => store.dispatch(reduxCrud.actionCreatorsFor(TransactionResource.path).createSuccess({
  id: id,
  account_id: account_id,
  amount: amount,
  category_id: null,
  date: date,
  description: null,
  payee: 'Payee',
  transfer_account_id: null,
  type: 'to_be_budgeted',
  subtransactions: []
}));

export const createOutflow = (store, id, account_id, amount, category_id, date) => store.dispatch(reduxCrud.actionCreatorsFor(TransactionResource.path).createSuccess({
  id: id,
  account_id: account_id,
  amount: amount,
  category_id: category_id,
  date: date,
  description: null,
  payee: 'Payee',
  transfer_account_id: null,
  type: 'regular',
  subtransactions: []
}));

export const createTransfer = (store, id, account_id, transfer_account_id, amount, date) => store.dispatch(reduxCrud.actionCreatorsFor(TransactionResource.path).createSuccess({
  id: id,
  account_id: account_id,
  amount: amount,
  category_id: null,
  date: date,
  description: null,
  payee: null,
  transfer_account_id: transfer_account_id,
  type: 'regular'
}));
