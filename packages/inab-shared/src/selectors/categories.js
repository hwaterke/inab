import R from 'ramda'
import {createSelector} from 'reselect'
import type {Category} from '../entities/Category'
import {CategoryResource} from '../entities/Category'
import {select} from 'redux-crud-provider'

export const selectCategoriesByGroupId = createSelector(
  select(CategoryResource).asArray,
  (categories: Category[]) =>
    R.groupBy(
      R.prop('category_group_uuid'),
      R.sortBy(R.prop('priority'), categories)
    )
)
