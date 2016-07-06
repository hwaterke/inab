import { createSelector } from 'reselect';
import { createInMonthSelectors, createUpToMonthSelectors } from './ui';
import { createMappingSelector, sumOf } from './utils';

// All
export const getBudgetItems = (state) => state.budgetItems;

// Filters
export const inMonth = createInMonthSelectors(getBudgetItems, (bi) => bi.month);
export const upToMonth = createUpToMonthSelectors(getBudgetItems, (bi) => bi.month);

// Grouping
export const getSelectedMonthBudgetItemsByCategoryId = createMappingSelector(inMonth.current, 'category_id');

// Sums
export const getBudgetItemsSumUpToPreviousMonth = createSelector(
  upToMonth.previous,
  budgetItems => sumOf(budgetItems, 'amount')
);
