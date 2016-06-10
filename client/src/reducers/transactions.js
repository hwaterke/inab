import reduxCrud from 'redux-crud';
export default reduxCrud.reducersFor('transactions', {store: reduxCrud.STORE_MUTABLE});
import { createSelector } from 'reselect';
import { getSelectedMonth } from './ui';

export const getTransactions = state => state.transactions;

export const getSelectedMonthTransactions = createSelector(
  getSelectedMonth,
  getTransactions,
  (selectedMonth, transactions) => {
    const result = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() == selectedMonth.year && d.getMonth() + 1 == selectedMonth.month;
    });
    return result;
  }
);

export const getSelectedMonthTransactionsByCategoryId = createSelector(
  getSelectedMonthTransactions,
  transactions => {
    const result = {};
    transactions.forEach(function (t) {
      result[t.category_id] = result[t.category_id] || [];
      result[t.category_id].push(t);
    });
    return result;
  }
);
