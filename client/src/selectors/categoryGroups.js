import { createSelector } from 'reselect';
import { createMappingSelector } from './utils';

// All
export const getCategoryGroups = state => state.categoryGroups;

// Sorting
export const getSortedCategoryGroups = createSelector(
    getCategoryGroups,
    cgs => cgs.sort((a,b) => {
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
export const getCategoryGroupsById = createMappingSelector(getCategoryGroups, 'id');
