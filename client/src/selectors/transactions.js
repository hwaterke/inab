import {createSelector} from 'reselect';
import {createInMonthSelectors, createUpToMonthSelectors} from './ui';
import {beginningOfMonth, groupBy, mapMap, sumOfAmounts} from './utils';
import {selectTransactions} from './resources';

export const getSortedTransactions = createSelector(
  selectTransactions,
  transactions => transactions.concat().sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
      return -1;
    }
    if (a.amount != undefined && b.amount != undefined) {
      return a.amount - b.amount;
    }
    if (a.amount != undefined) {
      return -1;
    }
    if (b.amount != undefined) {
      return 1;
    }
    return 0;
  })
);

// Filters
export const inMonth = createInMonthSelectors(selectTransactions, (t) => beginningOfMonth(t.date));
export const upToMonth = createUpToMonthSelectors(selectTransactions, (t) => beginningOfMonth(t.date));

// Map
export const getPayees = createSelector(
  selectTransactions,
  transactions => [...new Set(transactions.filter(t => t.payee != null).map(t => t.payee))]
);

// Grouping
export const getToBeBudgetedSumUpToSelectedMonth = createSelector(
  upToMonth.current,
  transactions => sumOfAmounts(transactions.filter(t => t.type == 'to_be_budgeted'))
);

export const getSelectedMonthActivityByCategoryId = createSelector(
  inMonth.current,
  transactions => {
    return sumByCategoryId(transactions);
  }
);

// Utils

// Flattens a series of transactions to an array of [date, category_uuid, amount]
// including both transactions and subtransactions.
export const flattenTransactions = (transactions) => {
  const result = [];
  transactions.forEach((transaction) => {
    const category_uuid = transaction.category_uuid;
    if (category_uuid) {
      result.push({
        date: transaction.date,
        category_uuid: category_uuid,
        amount: transaction.amount || 0
      });
    }
    transaction.subtransactions.forEach((subt) => {
      const sub_category_uuid = subt.category_uuid;
      if (sub_category_uuid) {
        result.push({
          date: transaction.date,
          category_uuid: sub_category_uuid,
          amount: subt.amount || 0
        });
      }
    });
  });
  return result;
};

// Returns the sum of the amounts per category id for the transactions provided.
export const sumByCategoryId = (transactions) => {
  const result = groupBy(flattenTransactions(transactions), (t) => t.category_uuid);
  return mapMap(result, v => sumOfAmounts(v));
};
