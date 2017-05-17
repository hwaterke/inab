import {createCategory, createCategoryGroup} from './utils';
import {selectCategoriesByGroupId} from '../../src/selectors/categories';

export function categoriesSelectorTests(getStore) {
  describe('Category selectors', () => {
    test('groupsByGroupId', () => {
      createCategoryGroup(getStore(), 'cg1', 'Category Group 1', 1);
      createCategoryGroup(getStore(), 'cg2', 'Category Group 2', 2);
      createCategory(getStore(), 'c1-2', 'Category 1 in 2', 2, 'cg2');
      createCategory(getStore(), 'c2-2', 'Category 2 in 2', 1, 'cg2');
      createCategory(getStore(), 'c1-1', 'Category 1 in 1', 1, 'cg1');
      createCategory(getStore(), 'c2-1', 'Category 2 in 1', 2, 'cg1');

      expect(selectCategoriesByGroupId(getStore().getState())).toEqual({
        cg1: [
          {category_group_uuid: 'cg1', name: 'Category 1 in 1', priority: 1, uuid: 'c1-1'},
          {category_group_uuid: 'cg1', name: 'Category 2 in 1', priority: 2, uuid: 'c2-1'}
        ],
        cg2: [
          {category_group_uuid: 'cg2', name: 'Category 2 in 2', priority: 1, uuid: 'c2-2'},
          {category_group_uuid: 'cg2', name: 'Category 1 in 2', priority: 2, uuid: 'c1-2'}
        ]
      });
    });
  });
}
