// @flow
import reduxCrud from 'redux-crud';
import type {CategoryGroup} from '../../src/entities/CategoryGroup';
import {CategoryGroupResource} from '../../src/entities/CategoryGroup';
import type {Category} from '../../src/entities/Category';
import {CategoryResource} from '../../src/entities/Category';
import type {BudgetItem} from '../../src/entities/BudgetItem';
import {BudgetItemResource} from '../../src/entities/BudgetItem';

export const createCategoryGroup = (store: any, uuid: string, name: string, priority: number) => {
  const item: CategoryGroup = {uuid, name, priority};
  store.dispatch(
    reduxCrud.actionCreatorsFor(CategoryGroupResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};

export const createCategory = (store: any, uuid: string, name: string, priority: number, categoryGroupUuid: string) => {
  const item: Category = {uuid, name, priority, category_group_uuid: categoryGroupUuid};
  store.dispatch(
    reduxCrud.actionCreatorsFor(CategoryResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};

export const createBudgetItem = (store: any, uuid: string, month: string, category_uuid: string, amount: number) => {
  const item: BudgetItem = {uuid, month, category_uuid, amount};
  store.dispatch(
    reduxCrud.actionCreatorsFor(BudgetItemResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};
