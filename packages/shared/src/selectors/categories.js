import {groupBy, prop, sortBy, head, sort} from 'ramda'
import {createSelector} from 'reselect'
import {select} from 'redux-crud-provider'
import type {Category} from '../entities/Category'
import {CategoryResource} from '../entities/Category'
import {getSortedTransactions} from './transactions'

const categoriesAsArray = select(CategoryResource).asArray

export const selectCategoriesByGroupId = createSelector(
  categoriesAsArray,
  (categories: Category[]) =>
    groupBy(prop('category_group_uuid'), sortBy(prop('priority'), categories))
)

/**
 * This function suggests a category for a payee based on your last transactions
 *
 * It returns the last used category for that payee
 *
 * @param {*} payee: Value of a payee
 * @param {*} selectedCategory: Value of the currently selected category
 */
export const getCategorySuggestion = (payee, selectedCategory) => state => {
  const transactions = getSortedTransactions(state)
  const categories = categoriesAsArray(state)
  if (payee && !payee.startsWith('transfer:') && !selectedCategory) {
    return head(
      sort(
        prop('date'),
        transactions.filter(({payee_uuid}) => payee_uuid === payee)
      ).map(({category_uuid}) =>
        categories.find(cat => cat.uuid === category_uuid)
      )
    )
  }
}
