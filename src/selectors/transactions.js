// @flow
import R from 'ramda';
import {
  createInMonthSelectors,
  createUpToMonthSelectors,
  beginningOfMonth,
  sumOfAmounts
} from './utils';
import {arraySelector} from 'hw-react-shared';
import type {Transaction} from '../entities/Transaction';
import {TransactionResource} from '../entities/Transaction';
import {createSelector} from 'reselect';

const dateAmountSort = R.sortWith([R.descend(R.prop('date')), R.ascend(R.prop('amount'))]);

export const getSortedTransactions = createSelector(
  arraySelector(TransactionResource),
  (transactions: Transaction[]) => dateAmountSort(transactions)
);

export const transactionsInMonth = createInMonthSelectors(
  arraySelector(TransactionResource),
  (t: Transaction) => beginningOfMonth(t.date)
);

export const transactionsUpToMonth = createUpToMonthSelectors(
  arraySelector(TransactionResource),
  (t: Transaction) => beginningOfMonth(t.date)
);

export const getToBeBudgetedSumInSelectedMonth = createSelector(
  transactionsInMonth.selected,
  (transactions: Transaction[]) =>
    sumOfAmounts(transactions.filter(t => t.type === 'to_be_budgeted'))
);

export const getToBeBudgetedSumUpToSelectedMonth = createSelector(
  transactionsUpToMonth.selected,
  (transactions: Transaction[]) =>
    sumOfAmounts(transactions.filter(t => t.type === 'to_be_budgeted'))
);

/**
 * Flattens a series of transactions to an array of [date, category_uuid, amount] including both transactions and subtransactions.
 */
export const flattenTransactions = (transactions: Transaction[]) =>
  transactions
    .filter(t => t.category_uuid)
    .map(t => ({date: t.date, category_uuid: t.category_uuid, amount: t.amount || 0}))
    .concat(
      ...transactions.map(t =>
        t.subtransactions
          .filter(st => st.category_uuid)
          .map(st => ({date: t.date, category_uuid: st.category_uuid, amount: st.amount || 0}))
      )
    );

export const selectSelectedMonthActivityByCategoryId = createSelector(
  transactionsInMonth.selected,
  (transactions: Transaction[]) => {
    const reduceToAmountSumBy = R.reduceBy((acc, record) => acc + record.amount, 0);
    const sumByCategoryId = reduceToAmountSumBy(R.prop('category_uuid'));
    return sumByCategoryId(flattenTransactions(transactions));
  }
);
