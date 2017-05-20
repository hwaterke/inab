import R from 'ramda';
import {createSelector} from 'reselect';
import {arraySelector} from 'hw-react-shared';
import {CategoryResource} from '../entities/Category';

export const selectCategoriesByGroupId = createSelector(
  arraySelector(CategoryResource),
  categories => R.groupBy(R.prop('category_group_uuid'), R.sortBy(R.prop('priority'), categories))
);
