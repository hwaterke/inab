import {createCategory, createCategoryGroup} from './utils';
import {selectCategoriesByGroupId} from '../../src/selectors/categories';

export function categoriesSelectorTests(getStore) {
  describe('Category selectors', () => {
    test('groupsByGroupId', () => {
      createCategoryGroup(getStore(), 'cg1', 'Category Group 1', 1);
      createCategoryGroup(getStore(), 'cg2', 'Category Group 2', 2);
      const c12 = createCategory(getStore(), 'c1-2', 'Category 1 in 2', 2, 'cg2');
      const c22 = createCategory(getStore(), 'c2-2', 'Category 2 in 2', 1, 'cg2');
      const c11 = createCategory(getStore(), 'c1-1', 'Category 1 in 1', 1, 'cg1');
      const c21 = createCategory(getStore(), 'c2-1', 'Category 2 in 1', 2, 'cg1');

      expect(selectCategoriesByGroupId(getStore().getState())).toEqual({
        cg1: [c11, c21],
        cg2: [c22, c12]
      });
    });
  });
}
