import { createSelector } from 'reselect';
import { getSelectedMonth } from './ui';
import { groupBy, sumOf } from './utils';

export const getBudgetItems = (state) => state.budgetItems;

export const getSelectedMonthBudgetItems = createSelector(
  getSelectedMonth,
  getBudgetItems,
  (selectedMonth, budgetItems) => budgetItems.filter(bi => {
    const d = new Date(bi.month);
    return d.getFullYear() == selectedMonth.year && d.getMonth() + 1 == selectedMonth.month;
  })
);

export const getSelectedMonthBudgetItemsByCategoryId = createSelector(
  getSelectedMonthBudgetItems,
  budgetItems => {
    const result = {};
    budgetItems.forEach(bi => result[bi.category_id] = bi);
    return result;
  }
);

export const getBudgetItemsUpToPreviousMonth = createSelector(
  getSelectedMonth,
  getBudgetItems,
  (selectedMonth, budgetItems) => budgetItems.filter(bi => {
    const d = new Date(bi.month);
    return d.getFullYear() < selectedMonth.year || (d.getFullYear() == selectedMonth.year && d.getMonth() + 1 < selectedMonth.month);
  })
);

export const getBudgetItemsUpToSelectedMonth = createSelector(
  getSelectedMonth,
  getBudgetItems,
  (selectedMonth, budgetItems) => budgetItems.filter(bi => {
    const d = new Date(bi.month);
    return d.getFullYear() < selectedMonth.year || (d.getFullYear() == selectedMonth.year && d.getMonth() + 1 <= selectedMonth.month);
  })
);

export const getBudgetItemsUpToSelectedMonthByCategoryId = createSelector(
  getBudgetItemsUpToSelectedMonth,
  budgetItems => groupBy(budgetItems, 'category_id')
);

export const getBudgetItemsSum = createSelector(
  getBudgetItems,
  budgetItems => sumOf(budgetItems, 'amount')
);

export const getBudgetItemsSumUpToSelectedMonth = createSelector(
  getBudgetItemsUpToSelectedMonth,
  budgetItems => sumOf(budgetItems, 'amount')
);

export const getBudgetItemsSumUpToPreviousMonth = createSelector(
  getBudgetItemsUpToPreviousMonth,
  budgetItems => sumOf(budgetItems, 'amount')
);


export const getBudgetItemsSumUpToSelectedMonthByCategoryId = createSelector(
  getBudgetItemsUpToSelectedMonthByCategoryId,
  budgetItems => {
    const result = {};
    for (var [key, value] of budgetItems) {
      result[key] = value.reduce(function (a, b) {
        return b.amount == null ? a : a + b.amount;
      }, 0);
    }
    return result;
  }
);
