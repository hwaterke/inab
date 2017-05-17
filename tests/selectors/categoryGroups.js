import {createCategoryGroup} from './utils';
import {getSortedCategoryGroups} from '../../src/selectors/categoryGroups';

export function categoryGroupsSelectorTests(getStore) {
  describe('Category group selectors', () => {
    test('sorts', () => {
      createCategoryGroup(getStore(), 'cg3', 'Category Group 3', 3);
      createCategoryGroup(getStore(), 'cg1', 'Category Group 1', 1);
      createCategoryGroup(getStore(), 'cg2', 'Category Group 2', 2);

      expect(getSortedCategoryGroups(getStore().getState())).toEqual([
        {name: 'Category Group 1', priority: 1, uuid: 'cg1'},
        {name: 'Category Group 2', priority: 2, uuid: 'cg2'},
        {name: 'Category Group 3', priority: 3, uuid: 'cg3'}
      ]);
    });
  });
}
