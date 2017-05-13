import R from 'ramda';
import {createSelector} from 'reselect';
import {CategoryGroupResource} from 'inab-shared/src/entities/CategoryGroup';
import {arraySelector} from 'hw-react-shared/src/crud/selectors/selectors';

export const getSortedCategoryGroups = createSelector(arraySelector(CategoryGroupResource), cgs =>
  R.sortBy(R.prop('priority'), cgs)
);
