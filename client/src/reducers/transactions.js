import reduxCrud from 'redux-crud';
export default reduxCrud.reducersFor('transactions', {store: reduxCrud.STORE_MUTABLE});
import { createSelector } from 'reselect';
import { getSelectedMonth } from './ui';
import { groupBy } from './utils';

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
