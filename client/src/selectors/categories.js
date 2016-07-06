import { createSelector } from 'reselect';
import { createMappingSelector, createGroupingSelector } from './utils';

// All
export const getCategories = state => state.categories;

// Grouping
export const getCategoriesById = createMappingSelector(getCategories, 'id');
export const getCategoriesByGroupId = createGroupingSelector(getCategories, 'group_id');

export const getCategoryCount = createSelector(
  getCategories,
  categories => categories.length
);
