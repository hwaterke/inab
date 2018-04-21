// @flow
import {
  createInflowTBB,
  createAccount,
  createOutflow,
  createCategory,
  createCategoryGroup,
  createTransfer,
  createBudgetItem,
  dispatchSelectMonth
} from './utils';
import {
  getBudgetBalance,
  goalToBudgetByCategoryForSelectedMonth,
  selectBalanceByAccountId
} from '../../src/selectors/budget';
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
      category1 = createCategory(getStore(), {
        uuid: 'c1',
        name: 'Category 1',
        priority: 1,
        category_group_uuid: 'cg1'
      });
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
          [account1.uuid]: 23 + 17 - 3 - 11 + 7,
          [account2.uuid]: 11 - 7
        });
      });
    });

    describe('goalToBudgetByCategoryForSelectedMonth', () => {
      let categoryTBD;
      let categoryMF;

      beforeEach(() => {
        dispatchSelectMonth(getStore(), 2017, 5);
        createCategory(getStore(), {
          uuid: 'cng',
          name: 'Category without goal',
          priority: 1,
          category_group_uuid: 'cg1'
        });

        createCategory(getStore(), {
          uuid: 'ctb',
          name: 'Category Target Balance',
          priority: 2,
          category_group_uuid: 'cg1',
          goal_type: 'tb',
          goal_creation_month: '2017-06-01',
          target_balance: 500
        });

        categoryTBD = createCategory(getStore(), {
          uuid: 'ctbd',
          name: 'Category Target Balance By Date',
          priority: 3,
          category_group_uuid: 'cg1',
          goal_type: 'tbd',
          goal_creation_month: '2017-06-01',
          target_balance_month: '2018-06-01',
          target_balance: 500
        });

        categoryMF = createCategory(getStore(), {
          uuid: 'ctmf',
          name: 'Category Monthly Funding',
          priority: 4,
          category_group_uuid: 'cg1',
          goal_type: 'mf',
          goal_creation_month: '2017-06-01',
          monthly_funding: 500
        });
      });

      test('should return target when nothing is budgeted', () => {
        expect(goalToBudgetByCategoryForSelectedMonth(getStore().getState())).toEqual({
          ctbd: 42,
          ctmf: 500
        });
      });

      test('should take into account budgeted for monthly funding', () => {
        createBudgetItem(getStore(), 'bi1', '2017-06-01', categoryMF.uuid, 300);
        expect(goalToBudgetByCategoryForSelectedMonth(getStore().getState())).toEqual({
          ctbd: 42,
          ctmf: 200
        });
      });

      test('should take into account budgeted for target budget by date', () => {
        createBudgetItem(getStore(), 'bi2', '2017-06-01', categoryTBD.uuid, 20);
        expect(goalToBudgetByCategoryForSelectedMonth(getStore().getState())).toEqual({
          ctbd: 22,
          ctmf: 500
        });
      });
    });
  });
}
