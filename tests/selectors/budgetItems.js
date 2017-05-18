import {createCategory, createCategoryGroup, createBudgetItem} from './utils';
import {
  inMonth,
  upToMonth,
  getSelectedMonthBudgetItemsByCategoryId,
  getBudgetItemsSumUpToPreviousMonth
} from '../../src/selectors/budgetItems';
import {selectMonth} from '../../src/reducers/month';

export function budgetItemsSelectorTests(getStore) {
  describe('Budget Items selectors', () => {
    beforeEach(() => {
      createCategoryGroup(getStore(), 'cg1', 'Category Group 1', 1);
      createCategory(getStore(), 'c1', 'Category 1', 1, 'cg1');
      createCategory(getStore(), 'c2', 'Category 2', 2, 'cg1');
    });

    test('inMonth', () => {
      const bi1 = createBudgetItem(getStore(), 'bi1', '2017-05-01', 'c1', 100);
      const bi2 = createBudgetItem(getStore(), 'bi2', '2017-06-01', 'c1', 100);
      const bi3 = createBudgetItem(getStore(), 'bi3', '2017-07-01', 'c1', 100);
      getStore().dispatch(selectMonth(2017, 5));

      expect(inMonth.previous(getStore().getState())).toEqual([bi1]);
      expect(inMonth.selected(getStore().getState())).toEqual([bi2]);
      expect(inMonth.next(getStore().getState())).toEqual([bi3]);
    });

    test('upToMonth', () => {
      const bi1 = createBudgetItem(getStore(), 'bi1', '2017-05-01', 'c1', 100);
      const bi2 = createBudgetItem(getStore(), 'bi2', '2017-06-01', 'c1', 100);
      const bi3 = createBudgetItem(getStore(), 'bi3', '2017-07-01', 'c1', 100);
      getStore().dispatch(selectMonth(2017, 5));

      expect(upToMonth.previous(getStore().getState())).toEqual([bi1]);
      expect(upToMonth.selected(getStore().getState())).toEqual([bi1, bi2]);
      expect(upToMonth.next(getStore().getState())).toEqual([bi1, bi2, bi3]);
    });

    test('getSelectedMonthBudgetItemsByCategoryId', () => {
      createBudgetItem(getStore(), 'bi1', '2017-05-01', 'c1', 100);
      const bi2 = createBudgetItem(getStore(), 'bi2', '2017-06-01', 'c1', 100);
      const bi3 = createBudgetItem(getStore(), 'bi3', '2017-06-01', 'c2', 200);
      const bi4 = createBudgetItem(getStore(), 'bi4', '2017-06-01', 'c2', 250);
      createBudgetItem(getStore(), 'bi5', '2017-07-01', 'c1', 100);
      getStore().dispatch(selectMonth(2017, 5));

      expect(getSelectedMonthBudgetItemsByCategoryId(getStore().getState())).toEqual({
        c1: [bi2],
        c2: [bi3, bi4]
      });
    });

    test('getBudgetItemsSumUpToPreviousMonth', () => {
      createBudgetItem(getStore(), 'bi1', '2017-04-01', 'c1', 3);
      createBudgetItem(getStore(), 'bi2', '2017-05-01', 'c1', 5);
      createBudgetItem(getStore(), 'bi3', '2017-06-01', 'c1', 7);
      createBudgetItem(getStore(), 'bi4', '2017-07-01', 'c1', 11);
      getStore().dispatch(selectMonth(2017, 5));

      expect(getBudgetItemsSumUpToPreviousMonth(getStore().getState())).toEqual(8);
    });
  });
}
