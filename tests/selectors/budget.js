// @flow
import {createInflowTBB, createAccount, createOutflow, createCategory, createCategoryGroup, createTransfer} from './utils';
import {getBudgetBalance, selectBalanceByAccountId} from '../../src/selectors/budget';
import type {Account} from '../../src/entities/Account';
import type {Category} from '../../src/entities/Category';

export function budgetSelectorTests(getStore: Function) {
  describe('Budget selectors', () => {
    let account1: Account;
    let account2: Account;
    let category1: Category;

    beforeEach(() => {
      account1 = createAccount(getStore(), 'acc1', 'Account 1');
      account2 = createAccount(getStore(), 'acc2', 'Account 2');
      createCategoryGroup(getStore(), 'cg1', 'Category Group 1', 1);
      category1 = createCategory(getStore(), 'c1', 'Category 1', 1, 'cg1');
    });

    describe('getBudgetBalance', () => {
      test('should be empty by default', () => {
        expect(getBudgetBalance(getStore().getState())).toEqual(0);
      });

      test('should reflect transactions', () => {
        createInflowTBB(getStore(), 't1', account1.uuid, '2017-05-01', 23);
        createInflowTBB(getStore(), 't2', account1.uuid, '2017-06-01', 17);
        createOutflow(getStore(), 't3', account1.uuid, '2017-06-05', -3, category1.uuid);
        createTransfer(getStore(), 't4', account1.uuid, account2.uuid, '2017-06-07', -11);
        expect(getBudgetBalance(getStore().getState())).toEqual(37);
      });
    });

    describe('selectBalanceByAccountId', () => {
      test('should be empty by default', () => {
        expect(selectBalanceByAccountId(getStore().getState())).toEqual({});
      });

      test('should reflect transactions', () => {
        createInflowTBB(getStore(), 't1', account1.uuid, '2017-05-01', 23);
        createInflowTBB(getStore(), 't2', account1.uuid, '2017-06-01', 17);
        createOutflow(getStore(), 't3', account1.uuid, '2017-06-05', -3, category1.uuid);
        createTransfer(getStore(), 't4', account1.uuid, account2.uuid, '2017-06-07', -11);
        createTransfer(getStore(), 't5', account2.uuid, account1.uuid, '2017-06-07', -7);
        expect(selectBalanceByAccountId(getStore().getState())).toEqual({
          [account1.uuid]: 23+17-3-11+7,
          [account2.uuid]: 11-7,
        });
      });
    });

  });
}
