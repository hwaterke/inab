import R from 'ramda'
import {createSelector} from 'reselect'
import {select} from 'redux-crud-provider'
import {CategoryGroupResource} from '../entities/CategoryGroup'

export const getSortedCategoryGroups = createSelector(
  select(CategoryGroupResource).asArray,
  cgs => R.sortBy(R.prop('priority'), cgs)
)
