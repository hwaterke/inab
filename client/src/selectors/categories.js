import {createSelector} from 'reselect';
import {createMappingSelector, createGroupingSelector} from './utils';
import sortBy from 'lodash/sortBy';

// All
export const getCategories = state => state.categories;

// Sorting
export const getSortedCategories = createSelector(
  getCategories,
  categories => sortBy(categories, ['priority'])
);

// Grouping
export const getCategoriesById = createMappingSelector(getSortedCategories, 'uuid');
export const getCategoriesByGroupId = createGroupingSelector(getCategories, 'category_group_uuid');

export const getCategoryCount = createSelector(
  getCategories,
  categories => categories.length
);
