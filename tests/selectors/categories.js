import {createCategory, createCategoryGroup} from './utils';
import {selectCategoriesByGroupId} from '../../src/selectors/categories';

export function categoriesSelectorTests(getStore) {
  describe('Category selectors', () => {
    test('groupsByGroupId', () => {
      createCategoryGroup(getStore(), 'cg1', 'Category Group 1', 1);
      createCategoryGroup(getStore(), 'cg2', 'Category Group 2', 2);
      const c12 = createCategory(getStore(), {
        uuid: 'c1-2',
        name: 'Category 1 in 2',
        priority: 2,
        category_group_uuid: 'cg2'
      });
      const c22 = createCategory(getStore(), {
        uuid: 'c2-2',
        name: 'Category 2 in 2',
        priority: 1,
        category_group_uuid: 'cg2'
      });
      const c11 = createCategory(getStore(), {
        uuid: 'c1-1',
        name: 'Category 1 in 1',
        priority: 1,
        category_group_uuid: 'cg1'
      });
      const c21 = createCategory(getStore(), {
        uuid: 'c2-1',
        name: 'Category 2 in 1',
        priority: 2,
        category_group_uuid: 'cg1'
      });

      expect(selectCategoriesByGroupId(getStore().getState())).toEqual({
        cg1: [c11, c21],
        cg2: [c22, c12]
      });
    });
  });
}
