import R from 'ramda';
import {createSelector} from 'reselect';
import {arraySelector} from 'hw-react-shared';
import {CategoryGroupResource} from '../entities/CategoryGroup';

export const getSortedCategoryGroups = createSelector(arraySelector(CategoryGroupResource), cgs =>
  R.sortBy(R.prop('priority'), cgs)
);
