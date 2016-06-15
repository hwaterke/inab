import { createSelector } from 'reselect';

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
