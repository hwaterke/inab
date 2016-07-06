import { createSelector } from 'reselect';
import { getCategories } from "../selectors/categories";
import { getTransactions, getToBeBudgetedSumUpToSelectedMonth, upToMonth as transactionsUpTo } from "../selectors/transactions";
import { getBudgetItems, getBudgetItemsSumUpToPreviousMonth, inMonth as budgetItemsIn, upToMonth as budgetItemsUpTo } from "../selectors/budgetItems";
import { beginningOfMonth, sumOf, groupBy, groupByKey } from './utils';
import { getCurrentMonth, getPreviousMonth } from './ui';

// Returns the sum of all budget items and transactions by category and by month (chronological)
const sumOfBudgetItemsAndTransactionsByCategoryByMonth = createSelector(
  getCategories,
  getBudgetItems,
  getTransactions,
  (categories, budgetItems, transactions) => {
    const result = new Map();

    // Initialize the result for each existing category.
    categories.forEach((c) => result.set(c.id, new Map()));

    // Group budgetItems and transactions by category id and month
    const biCM = groupBy(budgetItems, (i) => i.category_id, (i) => i.month);
    const trCM = groupBy(transactions.filter((t) => t.category_id), (i) => i.category_id, (i) => beginningOfMonth(i.date));

    // Add the amount of all budgetItems
    biCM.forEach((g, category_id) => {
      g.forEach((items, month) => {
        const categoryResult = result.get(category_id);
        categoryResult.set(month, categoryResult.get(month) || 0);
        categoryResult.set(month, categoryResult.get(month) + sumOf(items, 'amount'));
      });
    });

    // Add the amount of all transactions with a valid category_id
    trCM.forEach((g, category_id) => {
      g.forEach((items, month) => {
        const categoryResult = result.get(category_id);
        categoryResult.set(month, categoryResult.get(month) || 0);
        categoryResult.set(month, categoryResult.get(month) + sumOf(items, 'amount'));
      });
    });

    // Sort the result chronologically
    const sortedResult = new Map();
    result.forEach((g, category_id) => {
      const sortedMonth = new Map();
      Array.from(g.keys()).sort().forEach((m) => sortedMonth.set(m, g.get(m)));
      sortedResult.set(category_id, sortedMonth);
    });

    return sortedResult;
  }
);

// Returns overspendings by category and by month
const getOverspendingByCategoryIdByMonth = createSelector(
  sumOfBudgetItemsAndTransactionsByCategoryByMonth,
  (input) => {
    const overspendings = new Map();
    input.forEach((g, category_id) => {
      let sumAccrossMonths = 0;
      g.forEach((value, month) => {
        sumAccrossMonths += value;
        if (sumAccrossMonths < 0) {
          overspendings.set(category_id, new Map());
          overspendings.get(category_id).set(month, sumAccrossMonths);
          sumAccrossMonths = 0;
        }
      });
    });
    return overspendings;
  }
);

// Returns for each category the amount available in the budget for that category for the month
export const getAvailableByCategoryIdForSelectedMonth = createSelector(
  getCategories,
  budgetItemsUpTo.current,
  transactionsUpTo.current,
  getCurrentMonth,
  getOverspendingByCategoryIdByMonth,
  (categories, budgetItems, transactions, currentMonth, overspendings) => {
    const result = new Map();

    // Initialize the result for each existing category.
    categories.forEach((c) => result.set(c.id, 0));

    groupByKey(budgetItems, 'category_id').forEach((v, category_id) => {
      result.set(category_id, result.get(category_id) + sumOf(v, 'amount'));
    });

    groupByKey(transactions.filter((t) => t.category_id), 'category_id').forEach((v, category_id) => {
      result.set(category_id, result.get(category_id) + sumOf(v, 'amount'));
    });

    // Overspending handling. The overspending is moved to the funds available for next month.
    overspendings.forEach((v, category_id) => {
      v.forEach((overspending, month) => {
        // Only up to last month
        if (currentMonth.isAfter(month)) {
          result.set(category_id, result.get(category_id) - overspending);
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
  getCurrentMonth,
  getOverspendingByCategoryIdByMonth,
  (toBeBudgetedSumUpToSelectedMonth, budgetItemsSum, currentMonth, overspendings) => {
    let total = 0;

    // Add inflow for the month
    total += toBeBudgetedSumUpToSelectedMonth;

    // Remove money already budgeted in previous months
    total -= budgetItemsSum;

    // Add all the overspendings from previous months (coupel of months old)
    overspendings.forEach((v) => {
      v.forEach((overspending, month) => {
        // Only for overspending at least 2 month old.
        if (currentMonth.subtract(2, 'months').isSameOrAfter(month)) {
          total += overspending;
        }
      });
    });

    return total;
  }
);

// Overspent last month
export const getOverspentLastMonth = createSelector(
  getPreviousMonth,
  getOverspendingByCategoryIdByMonth,
  (previousMonth, overspendings) => {
    let total = 0;
    overspendings.forEach((v) => {
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
  (items) => sumOf(items, 'amount')
);

// Budgeted in the future
export const getBudgetedInFuture = createSelector(
  getFundsForSelectedMonth,
  getOverspentLastMonth,
  getBudgetedThisMonth,
  getCurrentMonth,
  getBudgetItems,
  (funds, overspent, budgeted, currentMonth, allBudgetItems) => {
    const maximum = Math.max(0, funds + overspent - budgeted);
    const futureBudgeting = sumOf(allBudgetItems.filter(i => currentMonth.isBefore(i.month)), 'amount');
    return Math.min(maximum, futureBudgeting);
  }
);

// Available to budget
export const getAvailableToBudget = createSelector(
  getFundsForSelectedMonth,
  getOverspentLastMonth,
  getBudgetedThisMonth,
  getBudgetedInFuture,
  (funds, overspent, budgeted, budgetedFuture) => funds + overspent - budgeted - budgetedFuture
);
