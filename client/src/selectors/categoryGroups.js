import { createMappingSelector } from './utils';

// All
export const getCategoryGroups = state => state.categoryGroups;

// Grouping
export const getCategoryGroupsById = createMappingSelector(getCategoryGroups, 'id');
