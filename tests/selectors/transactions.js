// @flow
import {flattenTransactions, getPayees, getToBeBudgetedSumUpToSelectedMonth, transactionsInMonth, transactionsUpToMonth, getSortedTransactions, selectSelectedMonthActivityByCategoryId} from '../../src/selectors/transactions';
import {createOutflow, createInflowTBB} from './utils';
import {selectMonth} from '../../src/reducers/month';

export function transactionsSelectorTests(getStore: Function) {
  describe('Transactions selectors', () => {

    test('getSortedTransactions', () => {
      const t1 = createOutflow(getStore(), 't1', 'acc1', '2017-04-05', -50, 'cat1');
      const t2 = createOutflow(getStore(), 't2', 'acc1', '2017-07-10', -100, 'cat1');
      const t3 = createOutflow(getStore(), 't3', 'acc1', '2017-07-10', -200, 'cat1');
      getStore().dispatch(selectMonth(2017, 5));

      expect(getSortedTransactions(getStore().getState())).toEqual([t3, t2, t1]);
    });

    test('inMonth', () => {
      const t1 = createOutflow(getStore(), 't1', 'acc1', '2017-05-05', -3, 'cat1');
      const t2 = createOutflow(getStore(), 't2', 'acc1', '2017-06-11', -3, 'cat1');
      const t3 = createOutflow(getStore(), 't3', 'acc1', '2017-07-21', -3, 'cat1');
      getStore().dispatch(selectMonth(2017, 5));

      expect(transactionsInMonth.previous(getStore().getState())).toEqual([t1]);
      expect(transactionsInMonth.selected(getStore().getState())).toEqual([t2]);
      expect(transactionsInMonth.next(getStore().getState())).toEqual([t3]);
    });

    test('upToMonth', () => {
      const t1 = createOutflow(getStore(), 't1', 'acc1', '2017-05-05', -3, 'cat1');
      const t2 = createOutflow(getStore(), 't2', 'acc1', '2017-06-11', -3, 'cat1');
      const t3 = createOutflow(getStore(), 't3', 'acc1', '2017-07-21', -3, 'cat1');
      getStore().dispatch(selectMonth(2017, 5));

      expect(transactionsUpToMonth.previous(getStore().getState())).toEqual([t1]);
      expect(transactionsUpToMonth.selected(getStore().getState())).toEqual([t1, t2]);
      expect(transactionsUpToMonth.next(getStore().getState())).toEqual([t1, t2, t3]);
    });

    test('getToBeBudgetedSumUpToSelectedMonth', () => {
      createInflowTBB(getStore(), 't1', 'acc1', '2017-05-01', 3);
      createInflowTBB(getStore(), 't2', 'acc1', '2017-06-01', 5);
      createInflowTBB(getStore(), 't3', 'acc1', '2017-07-01', 7);
      getStore().dispatch(selectMonth(2017, 5));

      expect(getToBeBudgetedSumUpToSelectedMonth(getStore().getState())).toEqual(8);
    });

    test('getPayees', () => {
      createOutflow(getStore(), 't1', 'acc1', '2017-01-01', -3, 'cat1', 'Payee1');
      createOutflow(getStore(), 't2', 'acc1', '2017-01-01', -3, 'cat1');
      createOutflow(getStore(), 't3', 'acc1', '2017-01-01', -3, 'cat1', 'Payee1');
      createOutflow(getStore(), 't4', 'acc1', '2017-01-01', -3, 'cat1', 'Payee2');
      createOutflow(getStore(), 't5', 'acc1', '2017-01-01', -3, 'cat1', 'Payee3');
      expect(getPayees(getStore().getState())).toEqual(['Payee1', 'Payee2', 'Payee3']);
    });

    test('flattenTransactions', () => {
      const result = flattenTransactions([{
        uuid: 't1',
        date: '2017-01-01',
        amount: 3,
        category_uuid: 'category',
        account_uuid: 'account',
        type: 'regular',
        tags: [],
        subtransactions: []
      }, {
        uuid: 't2',
        date: '2017-01-01',
        amount: 5,
        account_uuid: 'account',
        type: 'regular',
        tags: [],
        subtransactions: []
      }, {
        uuid: 't3',
        date: '2017-01-01',
        amount: 5,
        account_uuid: 'account',
        type: 'regular',
        tags: [],
        subtransactions: [{
          uuid: 'st1',
          amount: 7,
          category_uuid: 'category'
        }]
      }]);

      expect(result).toEqual([{
        date: "2017-01-01",
        category_uuid: "category",
        amount: 3
      }, {
        date: "2017-01-01",
        category_uuid: "category",
        amount: 7
      }]);
    });

    test('selectSelectedMonthActivityByCategoryId', () => {
      createOutflow(getStore(), 't1', 'acc1', '2017-05-01', -1, 'cat1');
      createInflowTBB(getStore(), 't2', 'acc1', '2017-06-01', 3);
      createOutflow(getStore(), 't3', 'acc1', '2017-06-01', -3, 'cat1');
      createOutflow(getStore(), 't4', 'acc1', '2017-06-01', -5, 'cat1');
      createOutflow(getStore(), 't5', 'acc1', '2017-06-01', -7, 'cat2');
      getStore().dispatch(selectMonth(2017, 5));
      expect(selectSelectedMonthActivityByCategoryId(getStore().getState())).toEqual({
        cat1: -8,
        cat2: -7
      })
    });
  });
}
