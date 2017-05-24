import R from 'ramda';
import {createSelector} from 'reselect';
import {arraySelector} from 'hw-react-shared';
import {CategoryResource} from '../entities/Category';
import type {Category} from '../entities/Category';

export const selectCategoriesByGroupId = createSelector(
  arraySelector(CategoryResource),
  (categories: Category[]) =>
    R.groupBy(R.prop('category_group_uuid'), R.sortBy(R.prop('priority'), categories))
);
