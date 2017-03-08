import {createSelector} from 'reselect';
import {createMappingSelector} from './utils';
import sortBy from 'lodash/sortBy';

// All
export const getCategoryGroups = state => state.categoryGroups;

// Sorting
export const getSortedCategoryGroups = createSelector(
  getCategoryGroups,
  cgs => sortBy(cgs, ['priority'])
);

// Grouping
export const getCategoryGroupsById = createMappingSelector(getCategoryGroups, 'uuid');
