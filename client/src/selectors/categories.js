import R from 'ramda';
import {createSelector} from 'reselect';
import {arraySelector} from 'hw-react-shared/src/crud/selectors/selectors';
import {CategoryResource} from 'inab-shared/src/entities/Category';

export const selectCategoriesByGroupId = createSelector(
  arraySelector(CategoryResource),
  categories => R.groupBy(R.prop('category_group_uuid'), R.sortBy(R.prop('priority'), categories))
);
