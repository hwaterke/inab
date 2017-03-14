import reduxCrud from 'redux-crud';
import {AccountResource} from '../src/entities/Account';
import {CategoryResource} from '../src/entities/Category';
import {BudgetItemResource} from '../src/entities/BudgetItem';
import {TransactionResource} from '../src/entities/Transaction';

export const selectMonth = (store, year, month) => store.dispatch({
  type: 'SET_MONTH',
  year,
  month
});

export const createAccount = (store, uuid, name) => store.dispatch(reduxCrud.actionCreatorsFor(AccountResource.path, {key: 'uuid'}).createSuccess({
  uuid,
  name
}));

export const createCategory = (store, uuid, name) => store.dispatch(reduxCrud.actionCreatorsFor(CategoryResource.path, {key: 'uuid'}).createSuccess({
  uuid,
  name
}));

export const createBudgetItem = (store, uuid, month, category_uuid, amount) => store.dispatch(reduxCrud.actionCreatorsFor(BudgetItemResource.path, {key: 'uuid'}).createSuccess({
  uuid,
  month: month,
  category_uuid: category_uuid,
  amount: amount
}));

export const createInflowTBB = (store, uuid, account_uuid, amount, date) => store.dispatch(reduxCrud.actionCreatorsFor(TransactionResource.path, {key: 'uuid'}).createSuccess({
  uuid,
  account_uuid: account_uuid,
  amount: amount,
  category_uuid: null,
  date: date,
  description: null,
  payee: 'Payee',
  transfer_account_uuid: null,
  type: 'to_be_budgeted',
  subtransactions: []
}));

export const createOutflow = (store, uuid, account_uuid, amount, category_uuid, date) => store.dispatch(reduxCrud.actionCreatorsFor(TransactionResource.path, {key: 'uuid'}).createSuccess({
  uuid,
  account_uuid: account_uuid,
  amount: amount,
  category_uuid: category_uuid,
  date: date,
  description: null,
  payee: 'Payee',
  transfer_account_uuid: null,
  type: 'regular',
  subtransactions: []
}));

export const createTransfer = (store, uuid, account_uuid, transfer_account_uuid, amount, date) => store.dispatch(reduxCrud.actionCreatorsFor(TransactionResource.path, {key: 'uuid'}).createSuccess({
  uuid,
  account_uuid: account_uuid,
  amount: amount,
  category_uuid: null,
  date: date,
  description: null,
  payee: null,
  transfer_account_uuid: transfer_account_uuid,
  type: 'regular'
}));

