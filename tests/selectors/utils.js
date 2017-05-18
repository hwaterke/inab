import reduxCrud from 'redux-crud';
import {CategoryGroupResource} from '../../src/entities/CategoryGroup';
import {CategoryResource} from '../../src/entities/Category';
import {BudgetItemResource} from '../../src/entities/BudgetItem';

export const createCategoryGroup = (store, uuid, name, priority) => {
  const item = {uuid, name, priority};
  store.dispatch(
    reduxCrud.actionCreatorsFor(CategoryGroupResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};

export const createCategory = (store, uuid, name, priority, categoryGroupUuid) => {
  const item = {uuid, name, priority, category_group_uuid: categoryGroupUuid};
  store.dispatch(
    reduxCrud.actionCreatorsFor(CategoryResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};

export const createBudgetItem = (store, uuid, month, category_uuid, amount) => {
  const item = {uuid, month, category_uuid, amount};
  store.dispatch(
    reduxCrud.actionCreatorsFor(BudgetItemResource.path, {key: 'uuid'}).createSuccess(item)
  );
  return item;
};
