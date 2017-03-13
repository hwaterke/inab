import {combineReducers} from 'redux';
import reduxCrud from 'redux-crud';
import {AccountResource} from '../entities/Account';
import {CategoryResource} from '../entities/Category';
import {CategoryGroupResource} from '../entities/CategoryGroup';
import {BudgetItemResource} from '../entities/BudgetItem';
import {TransactionResource} from '../entities/Transaction';

const reducers = {};

[
  AccountResource,
  CategoryResource,
  CategoryGroupResource,
  BudgetItemResource,
  TransactionResource
].forEach(resource =>
  reducers[resource.path] = reduxCrud.Map.reducersFor(resource.path, {key: 'uuid'})
);

export const resourcesReducer = combineReducers(reducers);
