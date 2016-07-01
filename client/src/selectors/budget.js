import { createSelector } from 'reselect';
import { getToBeBudgetedSumUpToSelectedMonth } from "../selectors/transactions";
import { getBudgetItemsSum, getBudgetItemsSumUpToPreviousMonth } from "../selectors/budgetItems";

export const getFundsForSelectedMonth = createSelector(
  getToBeBudgetedSumUpToSelectedMonth,
  getBudgetItemsSumUpToPreviousMonth,
  (toBeBudgetedSumUpToSelectedMonth, budgetItemsSum) => toBeBudgetedSumUpToSelectedMonth - budgetItemsSum
);

export const getAvailableToBudget = createSelector(
  getToBeBudgetedSumUpToSelectedMonth,
  getBudgetItemsSum,
  (toBeBudgetedSumUpToSelectedMonth, budgetItemsSum) => toBeBudgetedSumUpToSelectedMonth - budgetItemsSum
);
