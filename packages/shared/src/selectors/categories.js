import {filter, groupBy, map, pipe, prop, sortBy, take, uniqBy} from 'ramda'
import {select} from 'redux-crud-provider'
import {createSelector} from 'reselect'
import type {Category} from '../entities/Category'
import {CategoryResource} from '../entities/Category'
import {getSortedTransactions} from './transactions'

export const selectCategoriesByGroupId = createSelector(
  select(CategoryResource).asArray,
  (categories: Category[]) =>
    groupBy(prop('category_group_uuid'), sortBy(prop('priority'), categories))
)

/**
 * This function suggests up to three categories for a payee based on your last transactions.
 *
 * It returns an array of suggested categories
 */
export const getCategorySuggestions = createSelector(
  getSortedTransactions,
  select(CategoryResource).byId,
  (transactions, categories) => {
    return payee => {
      if (payee && !payee.startsWith('transfer:')) {
        return take(
          3,
          pipe(
            filter(({payee_uuid}) => payee_uuid === payee),
            map(({category_uuid}) => categories[category_uuid]),
            uniqBy(prop('uuid'))
          )(transactions)
        )
      }
      return []
    }
  }
)
