import { createSelector } from 'reselect';

export const getCategoryGroups = state => state.categoryGroups;

export const getCategoryGroupsById = createSelector(
  getCategoryGroups,
  groups => {
    const result = {};
    groups.forEach(function (g) {
      result[g.id] = g;
    });
    return result;
  }
);
