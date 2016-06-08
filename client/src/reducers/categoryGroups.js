import reduxCrud from 'redux-crud';
import { createSelector } from 'reselect';
export default reduxCrud.reducersFor('category_groups', {store: reduxCrud.STORE_MUTABLE});

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
