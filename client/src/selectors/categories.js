import R from 'ramda';
import {createSelector} from 'reselect';
import {selectCategories} from './resources';

export const selectCategoriesByGroupId = createSelector(
  selectCategories,
  categories => R.groupBy(R.prop('category_group_uuid'), R.sortBy(R.prop('priority'), categories))
);
