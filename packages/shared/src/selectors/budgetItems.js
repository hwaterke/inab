// @flow
import R from 'ramda'
import {createSelector} from 'reselect'
import {arraySelector} from 'hw-react-shared'
import {
  createInMonthSelectors,
  createUpToMonthSelectors,
  sumOfAmounts,
} from './utils'
import {BudgetItemResource} from '../entities/BudgetItem'
import type {BudgetItem} from '../entities/BudgetItem'

export const budgetItemsInMonth = createInMonthSelectors(
  arraySelector(BudgetItemResource),
  (bi: BudgetItem) => bi.month
)

export const budgetItemsUpToMonth = createUpToMonthSelectors(
  arraySelector(BudgetItemResource),
  (bi: BudgetItem) => bi.month
)

export const getSelectedMonthBudgetItemByCategoryId = createSelector(
  budgetItemsInMonth.selected,
  (budgetItems: BudgetItem[]) =>
    R.map(R.head)(R.groupBy(R.prop('category_uuid'), budgetItems))
)

export const getBudgetItemsSumUpToPreviousMonth = createSelector(
  budgetItemsUpToMonth.previous,
  (budgetItems: BudgetItem[]) => sumOfAmounts(budgetItems)
)
