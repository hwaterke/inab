import { createSelector } from 'reselect';
import { getToBeBudgetedSumUpToSelectedMonth } from "../selectors/transactions";
import { getBudgetItemsSum } from "../selectors/budgetItems";

export const getAvailableToBudget = createSelector(
  getToBeBudgetedSumUpToSelectedMonth,
  getBudgetItemsSum,
  (toBeBudgetedSumUpToSelectedMonth, budgetItemsSum) => toBeBudgetedSumUpToSelectedMonth - budgetItemsSum
);
