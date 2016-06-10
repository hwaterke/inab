import reduxCrud from 'redux-crud';
import { createSelector } from 'reselect';
import { getSelectedMonthTransactionsByCategoryId } from './transactions';

export default reduxCrud.reducersFor('categories', {store: reduxCrud.STORE_MUTABLE});

export const getCategories = state => state.categories;

export const getCategoriesById = createSelector(
  getCategories,
  categories => {
    const result = {};
    categories.forEach(function (c) {
      result[c.id] = c;
    });
    return result;
  }
);

export const getCategoriesByGroupId = createSelector(
  getCategories,
  categories => {
    const result = {};
    categories.forEach(function (category) {
      const k = category.group_id;
      result[k] = result[k] || [];
      result[k].push(category);
    });
    return result;
  }
);

export const getCategoryCount = createSelector(
  getCategories,
  categories => categories.length
);

export const getSelectedMonthActivityByCategoryId = createSelector(
  getSelectedMonthTransactionsByCategoryId,
  transactions => {
    const result = {};
    for (let k in transactions) {
      result[k] = transactions[k].reduce(function (a, b) {
        return b.amount == null ? a : a + b.amount;
      }, 0);
    }
    console.log("getSelectedMonthActivityByCategoryId", result);
    return result;
  }
);
