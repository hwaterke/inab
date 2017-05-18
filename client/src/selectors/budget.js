/**
 * Returns the balance of the budget i.e. the total amount of money across accounts.
 */
import {createSelector} from 'reselect';
import {
  getToBeBudgetedSumUpToSelectedMonth,
  upToMonth as transactionsUpTo,
  flattenTransactions
} from '../selectors/transactions';
import {
  getBudgetItemsSumUpToPreviousMonth,
  inMonth as budgetItemsIn,
  upToMonth as budgetItemsUpTo
} from '../selectors/budgetItems';
import {beginningOfMonth, groupBy, groupByKey, sumOfAmounts} from './utils';
import {arraySelector} from 'hw-react-shared/src/crud/selectors/selectors';
import {AccountResource} from 'inab-shared/src/entities/Account';
import {TransactionResource} from 'inab-shared/src/entities/Transaction';
import {CategoryResource} from 'inab-shared/src/entities/Category';
import {BudgetItemResource} from 'inab-shared/src/entities/BudgetItem';
import {getPreviousMonthMoment, getSelectedMonthMoment} from 'inab-shared/src/selectors/month';

export const getBudgetBalance = createSelector(arraySelector(TransactionResource), transactions =>
  sumOfAmounts(transactions.filter(t => !t.transfer_account_uuid))
);

/**
 * Returns the balance per account
 */
export const selectBalanceByAccountId = createSelector(
  arraySelector(AccountResource),
  arraySelector(TransactionResource),
  (accounts, transactions) => {
    const result = {};
    accounts.forEach(a => (result[a.uuid] = 0));
    transactions.forEach(t => {
      result[t.account_uuid] = result[t.account_uuid] + t.amount;
      if (t.transfer_account_uuid) {
        result[t.transfer_account_uuid] = result[t.transfer_account_uuid] - t.amount;
      }
    });
    return result;
  }
);

// Returns the sum of all budget items and transactions by category and by month (chronological)
const sumOfBudgetItemsAndTransactionsByCategoryByMonth = createSelector(
  arraySelector(CategoryResource),
  arraySelector(BudgetItemResource),
  arraySelector(TransactionResource),
  (categories, budgetItems, transactions) => {
    const result = new Map();

    // Initialize the result for each existing category.
    categories.forEach(c => result.set(c.uuid, new Map()));

    // Group budgetItems and transactions by category id and month
    const biCM = groupBy(budgetItems, i => i.category_uuid, i => i.month);

    // Add the amount of all budgetItems
    biCM.forEach((g, category_uuid) => {
      g.forEach((items, month) => {
        const categoryResult = result.get(category_uuid);
        categoryResult.set(month, categoryResult.get(month) || 0);
        categoryResult.set(month, categoryResult.get(month) + sumOfAmounts(items));
      });
    });

    flattenTransactions(transactions).forEach(ft => {
      const month = beginningOfMonth(ft.date);
      const categoryResult = result.get(ft.category_uuid);
      categoryResult.set(month, categoryResult.get(month));
      categoryResult.set(month, (categoryResult.get(month) || 0) + ft.amount);
    });

    // Sort the result chronologically
    const sortedResult = new Map();
    result.forEach((g, category_uuid) => {
      const sortedMonth = new Map();
      Array.from(g.keys()).sort().forEach(m => sortedMonth.set(m, g.get(m)));
      sortedResult.set(category_uuid, sortedMonth);
    });

    return sortedResult;
  }
);

// Returns overspendings by category and by month
const getOverspendingByCategoryIdByMonth = createSelector(
  sumOfBudgetItemsAndTransactionsByCategoryByMonth,
  input => {
    const overspendings = new Map();
    input.forEach((g, category_uuid) => {
      let sumAccrossMonths = 0;
      g.forEach((value, month) => {
        sumAccrossMonths += value;
        if (sumAccrossMonths < 0) {
          overspendings.set(category_uuid, new Map());
          overspendings.get(category_uuid).set(month, sumAccrossMonths);
          sumAccrossMonths = 0;
        }
      });
    });
    return overspendings;
  }
);

// Returns for each category the amount available in the budget for that category for the month
export const getAvailableByCategoryIdForSelectedMonth = createSelector(
  arraySelector(CategoryResource),
  budgetItemsUpTo.current,
  transactionsUpTo.current,
  getSelectedMonthMoment,
  getOverspendingByCategoryIdByMonth,
  (categories, budgetItems, transactions, currentMonth, overspendings) => {
    const result = new Map();

    // Initialize the result for each existing category.
    categories.forEach(c => result.set(c.uuid, 0));

    groupByKey(budgetItems, 'category_uuid').forEach((v, category_uuid) => {
      result.set(category_uuid, result.get(category_uuid) + sumOfAmounts(v));
    });

    flattenTransactions(transactions).forEach(ft => {
      result.set(ft.category_uuid, result.get(ft.category_uuid) + ft.amount);
    });

    // Overspending handling. The overspending is moved to the funds available for next month.
    overspendings.forEach((v, category_uuid) => {
      v.forEach((overspending, month) => {
        // Only up to last month
        if (currentMonth.isAfter(month)) {
          result.set(category_uuid, result.get(category_uuid) - overspending);
        }
      });
    });

    return result;
  }
);

// Funds for the month
export const getFundsForSelectedMonth = createSelector(
  getToBeBudgetedSumUpToSelectedMonth,
  getBudgetItemsSumUpToPreviousMonth,
  getSelectedMonthMoment,
  getOverspendingByCategoryIdByMonth,
  (toBeBudgetedSumUpToSelectedMonth, budgetItemsSum, currentMonth, overspendings) => {
    let total = 0;

    // Add inflow for the month
    total += toBeBudgetedSumUpToSelectedMonth;

    // Remove money already budgeted in previous months
    total -= budgetItemsSum;

    // Add all the overspendings from previous months (coupel of months old)
    const twoMonthsBack = currentMonth.clone().subtract(2, 'months');
    overspendings.forEach(v => {
      v.forEach((overspending, month) => {
        // Only for overspending at least 2 month old.
        if (twoMonthsBack.isSameOrAfter(month)) {
          total += overspending;
        }
      });
    });

    return total;
  }
);

// Overspent last month
export const getOverspentLastMonth = createSelector(
  getPreviousMonthMoment,
  getOverspendingByCategoryIdByMonth,
  (previousMonth, overspendings) => {
    let total = 0;
    overspendings.forEach(v => {
      v.forEach((overspending, month) => {
        // Only for last month
        if (previousMonth.isSame(month)) {
          total += overspending;
        }
      });
    });
    return total;
  }
);

// Budgeted this month
export const getBudgetedThisMonth = createSelector(
  budgetItemsIn.current,
  items => -sumOfAmounts(items)
);

// Budgeted in the future
export const getBudgetedInFuture = createSelector(
  getFundsForSelectedMonth,
  getOverspentLastMonth,
  getBudgetedThisMonth,
  getSelectedMonthMoment,
  arraySelector(BudgetItemResource),
  (funds, overspent, budgeted, currentMonth, allBudgetItems) => {
    const maximum = funds + overspent + budgeted;
    const futureBudgeting = sumOfAmounts(
      allBudgetItems.filter(i => currentMonth.isBefore(i.month))
    );
    return Math.min(0, -Math.min(maximum, futureBudgeting));
  }
);

// Available to budget
export const getAvailableToBudget = createSelector(
  getFundsForSelectedMonth,
  getOverspentLastMonth,
  getBudgetedThisMonth,
  getBudgetedInFuture,
  (funds, overspent, budgeted, budgetedFuture) => funds + overspent + budgeted + budgetedFuture
);
