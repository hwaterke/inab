import reduxCrud from 'redux-crud';
import {CategoryGroupResource} from '../../src/entities/CategoryGroup';
import {CategoryResource} from '../../src/entities/Category';

export const createCategoryGroup = (store, uuid, name, priority) =>
  store.dispatch(
    reduxCrud.actionCreatorsFor(CategoryGroupResource.path, {key: 'uuid'}).createSuccess({
      uuid,
      name,
      priority
    })
  );

export const createCategory = (store, uuid, name, priority, categoryGroupUuid) =>
  store.dispatch(
    reduxCrud.actionCreatorsFor(CategoryResource.path, {key: 'uuid'}).createSuccess({
      uuid,
      name,
      priority,
      category_group_uuid: categoryGroupUuid
    })
  );
