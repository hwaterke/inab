// @flow
import {ascend, descend, prop, reduceBy, sortWith} from 'ramda'
import {select} from 'redux-crud-provider'
import {createSelector} from 'reselect'
import type {Transaction} from '../entities/Transaction'
import {TransactionResource} from '../entities/Transaction'
import {
  beginningOfMonth,
  createInMonthSelectors,
  createUpToMonthSelectors,
  sumOfAmounts,
} from './utils'

const dateAmountSort = sortWith([descend(prop('date')), ascend(prop('amount'))])

export const getSortedTransactions = createSelector(
  select(TransactionResource).asArray,
  (transactions: Transaction[]) => dateAmountSort(transactions)
)

export const transactionsInMonth = createInMonthSelectors(
  select(TransactionResource).asArray,
  (t: Transaction) => beginningOfMonth(t.date)
)

export const transactionsUpToMonth = createUpToMonthSelectors(
  select(TransactionResource).asArray,
  (t: Transaction) => beginningOfMonth(t.date)
)

export const getToBeBudgetedSumInSelectedMonth = createSelector(
  transactionsInMonth.selected,
  (transactions: Transaction[]) =>
    sumOfAmounts(transactions.filter((t) => t.type === 'to_be_budgeted'))
)

export const getToBeBudgetedSumUpToSelectedMonth = createSelector(
  transactionsUpToMonth.selected,
  (transactions: Transaction[]) =>
    sumOfAmounts(transactions.filter((t) => t.type === 'to_be_budgeted'))
)

/**
 * Flattens a series of transactions to an array of [date, category_uuid, amount] including both transactions and subtransactions.
 */
export const flattenTransactions = (transactions: Transaction[]) =>
  transactions
    .filter((t) => t.category_uuid)
    .map((t) => ({
      date: t.date,
      category_uuid: t.category_uuid,
      amount: t.amount || 0,
    }))
    .concat(
      ...transactions.map((t) =>
        t.subtransactions
          .filter((st) => st.category_uuid)
          .map((st) => ({
            date: t.date,
            category_uuid: st.category_uuid,
            amount: st.amount || 0,
          }))
      )
    )

export const selectSelectedMonthActivityByCategoryId = createSelector(
  transactionsInMonth.selected,
  (transactions: Transaction[]) => {
    const reduceToAmountSumBy = reduceBy(
      (acc, record) => acc + record.amount,
      0
    )
    const sumByCategoryId = reduceToAmountSumBy(prop('category_uuid'))
    return sumByCategoryId(flattenTransactions(transactions))
  }
)
