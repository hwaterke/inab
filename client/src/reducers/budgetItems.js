import reduxCrud from 'redux-crud';
import { createSelector } from 'reselect';
import { getSelectedMonth } from './ui';

export default reduxCrud.reducersFor('budget_items', {store: reduxCrud.STORE_MUTABLE});

export const getBudgetItems = (state) => state.budgetItems;

export const getSelectedMonthBudgetItems = createSelector(
  getSelectedMonth,
  getBudgetItems,
  (selectedMonth, budgetItems) => budgetItems.filter(bi => {
    const d = new Date(bi.month);
    return d.getFullYear() == selectedMonth.year && d.getMonth() == selectedMonth.month;
  })
);

export const getSelectedMonthBudgetItemsByCategoryId = createSelector(
  getSelectedMonthBudgetItems,
  budgetItems => {
    console.log('getSelectedMonthBudgetItems', budgetItems);
    const result = {};
    budgetItems.forEach(bi => result[bi.category_id] = bi);
    console.log('getSelectedMonthBudgetItemsByCategoryId', result);
    return result;
  }
);
