import {getSortedCategoryGroups} from '../../src/selectors/categoryGroups'
import {createCategoryGroup} from './utils'

export function categoryGroupsSelectorTests(getStore) {
  describe('Category group selectors', () => {
    test('sorts', () => {
      const cg3 = createCategoryGroup(getStore(), 'cg3', 'Category Group 3', 3)
      const cg1 = createCategoryGroup(getStore(), 'cg1', 'Category Group 1', 1)
      const cg2 = createCategoryGroup(getStore(), 'cg2', 'Category Group 2', 2)

      expect(getSortedCategoryGroups(getStore().getState())).toEqual([
        cg1,
        cg2,
        cg3,
      ])
    })
  })
}
