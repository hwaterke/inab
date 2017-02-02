import {createSelector} from 'reselect';
import {createMappingSelector, createGroupingSelector} from './utils';

// All
export const getCategories = state => state.categories;

// Sorting
export const getSortedCategories = createSelector(
  getCategories,
  categories => categories.sort((a, b) => {
    if (a.priority < b.priority) {
      return -1;
    }
    if (a.priority > b.priority) {
      return 1;
    }
    return 0;
  })
);

// Grouping
export const getCategoriesById = createMappingSelector(getSortedCategories, 'id');
export const getCategoriesByGroupId = createGroupingSelector(getCategories, 'category_group_id');

export const getCategoryCount = createSelector(
  getCategories,
  categories => categories.length
);
