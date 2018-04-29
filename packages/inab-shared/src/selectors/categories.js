import {groupBy, prop, sortBy} from 'ramda'
import {createSelector} from 'reselect'
import type {Category} from '../entities/Category'
import {CategoryResource} from '../entities/Category'
import {select} from 'redux-crud-provider'

export const selectCategoriesByGroupId = createSelector(
  select(CategoryResource).asArray,
  (categories: Category[]) =>
    groupBy(prop('category_group_uuid'), sortBy(prop('priority'), categories))
)
