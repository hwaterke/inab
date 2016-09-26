import { createSelector } from 'reselect';
import { createInMonthSelectors, createUpToMonthSelectors } from './ui';
import { beginningOfMonth, createMappingSelector, createGroupingSelector, sumOf } from './utils';

// All
export const getTransactions = state => state.transactions;

// Filters
export const inMonth = createInMonthSelectors(getTransactions, (t) => beginningOfMonth(t.date));
export const upToMonth = createUpToMonthSelectors(getTransactions, (t) => beginningOfMonth(t.date));

// Grouping
export const getTransactionsById = createMappingSelector(getTransactions, 'id');
const getSelectedMonthTransactionsByCategoryId = createGroupingSelector(inMonth.current, 'category_id');

export const getToBeBudgetedSumUpToSelectedMonth = createSelector(
  upToMonth.current,
  transactions => sumOf(transactions.filter(t => t.type == "to_be_budgeted"), 'amount')
);

export const getSelectedMonthActivityByCategoryId = createSelector(
  getSelectedMonthTransactionsByCategoryId,
  transactions => {
    const result = new Map();
    transactions.forEach((value, key) => result.set(key, sumOf(value, 'amount')));
    return result;
  }
);
