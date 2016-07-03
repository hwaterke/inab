import { createSelector } from 'reselect';
import { getToBeBudgetedSumUpToSelectedMonth } from "../selectors/transactions";
import { getBudgetItemsSum, getBudgetItemsSumUpToPreviousMonth, getBudgetItemsUpToSelectedMonthByCategoryId } from "../selectors/budgetItems";


// For each category, how much is available
// Per category, sum per month if < 0 discard
export const getAvailableByCategoryId = createSelector(
  getBudgetItemsUpToSelectedMonthByCategoryId,
  (budgetItemByCategory) => {
    const result = {};
    // TODO
    return result;
  }
);

export const getFundsForSelectedMonth = createSelector(
  getToBeBudgetedSumUpToSelectedMonth,
  getBudgetItemsSumUpToPreviousMonth,
  (toBeBudgetedSumUpToSelectedMonth, budgetItemsSum) => toBeBudgetedSumUpToSelectedMonth - budgetItemsSum
);

// Overspent last month

// Budgeted this month

export const getAvailableToBudget = createSelector(
  getToBeBudgetedSumUpToSelectedMonth,
  getBudgetItemsSum,
  (toBeBudgetedSumUpToSelectedMonth, budgetItemsSum) => toBeBudgetedSumUpToSelectedMonth - budgetItemsSum
);
