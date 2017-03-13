import R from 'ramda';
import {createSelector} from 'reselect';
import {selectCategoryGroups} from './resources';

export const getSortedCategoryGroups = createSelector(
  selectCategoryGroups,
  cgs => R.sortBy(R.prop('priority'), cgs)
);
