import { createSelector } from 'reselect';
import { getSelectedMonth } from './ui';
import { groupBy, sumOf } from './utils';

export const getTransactions = state => state.transactions;

export const getSelectedMonthTransactions = createSelector(
  getSelectedMonth,
  getTransactions,
  (selectedMonth, transactions) => transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() == selectedMonth.year && d.getMonth() + 1 == selectedMonth.month;
  })
);

export const getSelectedMonthTransactionsByCategoryId = createSelector(
  getSelectedMonthTransactions,
  transactions => groupBy(transactions, 'category_id')
);

export const getTransactionsUpToSelectedMonth = createSelector(
  getSelectedMonth,
  getTransactions,
  (selectedMonth, transactions) => transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() < selectedMonth.year || (d.getFullYear() == selectedMonth.year && d.getMonth() + 1 <= selectedMonth.month);
  })
);

export const getTransactionsUpToSelectedMonthByCategoryId = createSelector(
  getTransactionsUpToSelectedMonth,
  transactions => groupBy(transactions, 'category_id')
);

export const getTransactionsSumUpToSelectedMonthByCategoryId = createSelector(
  getTransactionsUpToSelectedMonthByCategoryId,
  transactions => {
    const result = {};
    for (let k in transactions) {
      result[k] = transactions[k].reduce(function (a, b) {
        return b.amount == null ? a : a + b.amount;
      }, 0);
    }
    return result;
  }
);

export const getToBeBudgetedSumUpToSelectedMonth = createSelector(
  getTransactionsUpToSelectedMonth,
  transactions => sumOf(transactions.filter(t => t.inflow_to_be_budgeted), 'amount'));

export const getSelectedMonthActivityByCategoryId = createSelector(
  getSelectedMonthTransactionsByCategoryId,
  transactions => {
    const result = new Map();
    for (var [key, value] of transactions) {
      result[key] = sumOf(value, 'amount');
    }
    return result;
  }
);
