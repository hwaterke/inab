// @flow
import {
  createInflowTBB,
  createAccount,
  createOutflow,
  createCategory,
  createCategoryGroup,
  createBudgetItem,
  dispatchSelectMonth
} from './utils';
import type {Account} from '../../src/entities/Account';
import type {Category} from '../../src/entities/Category';
import {
  getAvailableByCategoryIdForSelectedMonth,
  getAvailableToBudget,
  getFundsForSelectedMonth,
  getOverspentLastMonth,
  getBudgetedThisMonth,
  getBudgetedInFuture
} from '../../src/selectors/budget';

export function budgetUseCaseTests(getStore: Function) {
  describe('Budget selectors', () => {
    let nextId: number;
    let account1: Account;
    let category1: Category;

    const getMonth = (delta = 0) => 5 + delta;
    const monthString = (month: number) => `2016-0${month + 1}-01`;

    const addInflow = (month, amount) =>
      createInflowTBB(getStore(), '' + nextId++, account1.uuid, monthString(month), amount);
    const addOutflow = (month, amount) =>
      createOutflow(
        getStore(),
        '' + nextId++,
        account1.uuid,
        monthString(month),
        amount,
        category1.uuid
      );
    const budget = (month, amount) =>
      createBudgetItem(getStore(), '' + nextId++, monthString(month), category1.uuid, amount);

    const expectAvailableByCategoryIdForSelectedMonth = (month, value) => {
      dispatchSelectMonth(getStore(), 2016, month);
      expect(getAvailableByCategoryIdForSelectedMonth(getStore().getState())).toEqual(value);
    };

    const expectAvailable = (month, amount: number) => {
      dispatchSelectMonth(getStore(), 2016, month);
      expect(getAvailableToBudget(getStore().getState())).toEqual(amount);
    };

    const expectFunds = (month, amount: number) => {
      dispatchSelectMonth(getStore(), 2016, month);
      expect(getFundsForSelectedMonth(getStore().getState())).toEqual(amount);
    };

    const expectOverspentLastMonth = (month, amount: number) => {
      dispatchSelectMonth(getStore(), 2016, month);
      expect(getOverspentLastMonth(getStore().getState())).toEqual(amount);
    };

    const expectBudgetedThisMonth = (month, amount: number) => {
      dispatchSelectMonth(getStore(), 2016, month);
      expect(getBudgetedThisMonth(getStore().getState())).toBe(amount);
    };

    const expectBudgetedInFuture = (month, amount: number) => {
      dispatchSelectMonth(getStore(), 2016, month);
      expect(getBudgetedInFuture(getStore().getState())).toBe(amount);
    };

    beforeEach(() => {
      nextId = 1;
      account1 = createAccount(getStore(), 'acc1', 'Account 1');
      createCategoryGroup(getStore(), 'cg1', 'Category Group 1', 1);
      category1 = createCategory(getStore(), {
        uuid: 'c1',
        name: 'Category 1',
        priority: 1,
        category_group_uuid: 'cg1'
      });
    });

    describe('Handle default state', function() {
      /*
       |     |  x  |     |
       |-----|-----|-----|
       |     |     |     |
       |=====|=====|=====|
       |  0  |  0  |  0  | Available to budget
       */
      describe('#getAvailableToBudget', function() {
        it('Should be 0 for previous month', () => expectAvailable(getMonth(-1), 0));
        it('Should be 0 for current month', () => expectAvailable(getMonth(), 0));
        it('Should be 0 for next month', () => expectAvailable(getMonth(1), 0));
      });
      describe('#getFundsForSelectedMonth', function() {
        it('Should be 0 for previous month', () => expectFunds(getMonth(-1), 0));
        it('Should be 0 for current month', () => expectFunds(getMonth(), 0));
        it('Should be 0 for next month', () => expectFunds(getMonth(1), 0));
      });
    });

    describe('Handle one inflow', function() {
      /*
       |     |  x  |     |
       |-----|-----|-----|
       |     |  +3 |     |
       |=====|=====|=====|
       |  0  |  3  |  3  | Available to budget
       */
      beforeEach(function() {
        addInflow(getMonth(), 3);
      });
      describe('#getAvailableToBudget', function() {
        it('Should ignore inflow of next month', () => expectAvailable(getMonth(-1), 0));
        it('Should include inflow of current month', () => expectAvailable(getMonth(), 3));
        it('Should include left over from last month', () => expectAvailable(getMonth(1), 3));
      });
      describe('#getFundsForSelectedMonth', function() {
        it('Should ignore inflow of next month', () => expectFunds(getMonth(-1), 0));
        it('Should include inflow of current month', () => expectFunds(getMonth(), 3));
        it('Should include left over from last month', () => expectFunds(getMonth(1), 3));
      });
    });

    describe('Multiple inflows', function() {
      /*
       |     |  x  |     |
       |-----|-----|-----|
       |  +3 |  +5 |  +7 |
       |=====|=====|=====|
       |  3  |  8  |  15 | Available to budget
       */
      beforeEach(function() {
        addInflow(getMonth(-1), 3);
        addInflow(getMonth(), 5);
        addInflow(getMonth(1), 7);
      });
      describe('#getAvailableToBudget', function() {
        it('Should ignore inflow of next months', () => expectAvailable(getMonth(-1), 3));
        it('Should combine inflow of current and previous month', () =>
          expectAvailable(getMonth(), 8));
        it('Should combine inflows over one month', () => expectAvailable(getMonth(1), 15));
      });
      describe('#getFundsForSelectedMonth', function() {
        it('Should ignore inflow of next month', () => expectFunds(getMonth(-1), 3));
        it('Should combine inflow of current and previous month', () => expectFunds(getMonth(), 8));
        it('Should combine inflows over one month', () => expectFunds(getMonth(1), 15));
      });
    });

    describe('Use less than last month remaining funds', function() {
      /*
       |     |  x  |     |
       |-----|-----|-----|
       |  +5 |  +7 | +13 |
       |     |   3 |     |
       |=====|=====|=====|
       |  2  |   9 |  22 | Available to budget
       */
      beforeEach(function() {
        addInflow(getMonth(-1), 5);
        addInflow(getMonth(), 7);
        addInflow(getMonth(1), 13);
        budget(getMonth(), 3);
      });
      describe('#getAvailableToBudget', function() {
        it('Should account for future budgeting', () => expectAvailable(getMonth(-1), 2));
        it('Should account for budgetting in current month', () => expectAvailable(getMonth(), 9));
        it('Should account for previous budgeting', () => expectAvailable(getMonth(1), 22));
      });
      describe('#getFundsForSelectedMonth', function() {
        it('should ignore future budgeting', () => expectFunds(getMonth(-1), 5));
        it('should ignore budgeting of the month', () => expectFunds(getMonth(), 5 + 7));
        it('should include past budgeting', () => expectFunds(getMonth(1), 5 + 7 - 3 + 13));
      });
    });

    describe('Use all of last month remaining funds', function() {
      /*
       |     |  x  |     |
       |-----|-----|-----|
       |  +5 |  +7 | +13 |
       |     |   5 |     |
       |=====|=====|=====|
       |  0  |   2 |  15 | Available to budget
       */
      beforeEach(function() {
        addInflow(getMonth(-1), 5);
        addInflow(getMonth(), 7);
        addInflow(getMonth(1), 13);
        budget(getMonth(), 5);
      });
      describe('#getAvailableToBudget', function() {
        it('Should account for future budgeting', () => expectAvailable(getMonth(-1), 0));
        it('Should account for budgetting in current month', () => expectAvailable(getMonth(), 7));
        it('Should account for previous budgeting', () => expectAvailable(getMonth(1), 20));
      });
      describe('#getFundsForSelectedMonth', function() {
        it('should ignore future budgeting', () => expectFunds(getMonth(-1), 5));
        it('should ignore budgeting of the month', () => expectFunds(getMonth(), 5 + 7));
        it('should include past budgeting', () => expectFunds(getMonth(1), 5 + 7 - 5 + 13));
      });
    });

    describe('Use more than last month remaining funds', function() {
      /*
       |     |  x  |     |
       |-----|-----|-----|
       |  +5 |  +7 | +13 |
       |     |   8 |     |
       |=====|=====|=====|
       |  0  |   4 |  17 | Available to budget
       */
      beforeEach(function() {
        addInflow(getMonth(-1), 5);
        addInflow(getMonth(), 7);
        addInflow(getMonth(1), 13);
        budget(getMonth(), 8);
      });
      describe('#getAvailableToBudget', function() {
        it('Should account for future budgeting', () => expectAvailable(getMonth(-1), 0));
        it('Should account for budgetting in current month', () => expectAvailable(getMonth(), 4));
        it('Should account for previous budgeting', () => expectAvailable(getMonth(1), 17));
      });
      describe('#getFundsForSelectedMonth', function() {
        it('should ignore future budgeting', () => expectFunds(getMonth(-1), 5));
        it('should ignore budgeting of the month', () => expectFunds(getMonth(), 5 + 7));
        it('should include past budgeting', () => expectFunds(getMonth(1), 5 + 7 - 8 + 13));
      });
    });

    describe('Over budgeting', function() {
      /*
       |     |  x  |     |
       |-----|-----|-----|
       |  +3 |  +5 |  +7 |
       |     |  50 |     |
       |=====|=====|=====|
       |  3  |   8 | -35 | Funds
       |  0  |   0 |   0 | Overspending last month
       |  0  | -50 |   0 | Budgeted this month
       |  -3 |   0 |   0 | Budgeted in the future
       |=====|=====|=====|
       |  0  | -42 | -35 | Available to budget
       */
      beforeEach(function() {
        addInflow(getMonth(-1), 3);
        addInflow(getMonth(), 5);
        addInflow(getMonth(1), 7);
        budget(getMonth(), 50);
      });

      describe('#getAvailableByCategoryIdForSelectedMonth', function() {
        it('should not affect previous month', () =>
          expectAvailableByCategoryIdForSelectedMonth(
            getMonth(-1),
            new Map([[category1.uuid, 0]])
          ));
        it('should affect current month', () =>
          expectAvailableByCategoryIdForSelectedMonth(getMonth(), new Map([[category1.uuid, 50]])));
        it('should affect next month', () =>
          expectAvailableByCategoryIdForSelectedMonth(
            getMonth(1),
            new Map([[category1.uuid, 50]])
          ));
      });

      describe('#getFundsForSelectedMonth', function() {
        it('should not affect previous month', () => expectFunds(getMonth(-1), 3));
        it('should not affect current month', () => expectFunds(getMonth(), 8));
        it('should be available next month', () => expectFunds(getMonth(1), -35));
      });

      describe('#getOverspentLastMonth', function() {
        it('should not affect previous month', () => expectOverspentLastMonth(getMonth(-1), 0));
        it('should not affect current month', () => expectOverspentLastMonth(getMonth(), 0));
        it('should not affect next month', () => expectOverspentLastMonth(getMonth(1), 0));
      });

      describe('#getBudgetedThisMonth', function() {
        it('should not affect previous month', () => expectBudgetedThisMonth(getMonth(-1), 0));
        it('should affect current month', () => expectBudgetedThisMonth(getMonth(), -50));
        it('should not affect next month', () => expectBudgetedThisMonth(getMonth(1), 0));
      });

      describe('#getBudgetedInFuture', function() {
        it('should affect previous month', () => expectBudgetedInFuture(getMonth(-1), -3));
        it('should not affect current month', () => expectBudgetedInFuture(getMonth(), 0));
        it('should not affect next month', () => expectBudgetedInFuture(getMonth(1), 0));
      });

      describe('#getAvailableToBudget', function() {
        it('should account for the budgeting', () => {
          expectAvailable(getMonth(-1), 0);
          expectAvailable(getMonth(), -42);
          expectAvailable(getMonth(1), -35);
        });
      });
    });

    describe('Overspending', function() {
      /*
       |     |  x  |     |     |
       |-----|-----|-----|-----|
       |     |  s5 |     |     |
       |=====|=====|=====|=====|
       |  0  |   0 |   0 |  -5 | Funds
       |  0  |   0 |  -5 |   0 | Overspending last month
       |  0  |   0 |   0 |   0 | Budgeted this month
       |  0  |   0 |   0 |   0 | Budgeted in the future
       |=====|=====|=====|=====|
       |  0  |   0 |  -5 |  -5 | Available to budget
       */
      beforeEach(function() {
        addOutflow(getMonth(), -5);
      });

      describe('#getAvailableByCategoryIdForSelectedMonth', function() {
        it('should be default without transactions', () =>
          expectAvailableByCategoryIdForSelectedMonth(
            getMonth(-1),
            new Map([[category1.uuid, 0]])
          ));
        it('should take transactions of this month into account', () =>
          expectAvailableByCategoryIdForSelectedMonth(getMonth(), new Map([[category1.uuid, -5]])));
        it('should be reset to 0 in case of overspending', () =>
          expectAvailableByCategoryIdForSelectedMonth(getMonth(1), new Map([[category1.uuid, 0]])));
        it('should be stay reset to 0 in case of overspending', () =>
          expectAvailableByCategoryIdForSelectedMonth(getMonth(2), new Map([[category1.uuid, 0]])));
      });

      describe('#getFundsForSelectedMonth', function() {
        it('should be default in previous month', () => expectFunds(getMonth(-1), 0));
        it('should not be affected by current month overspending', () =>
          expectFunds(getMonth(), 0));
        it('should not be affected by previous oversepnding', () => expectFunds(getMonth(1), 0));
        it('should be affected by oversepnding of couple month ago', () =>
          expectFunds(getMonth(2), -5));
      });

      describe('#getOverspentLastMonth', function() {
        it('should only affect month after spending', function() {
          expectOverspentLastMonth(getMonth(-1), 0);
          expectOverspentLastMonth(getMonth(), 0);
          expectOverspentLastMonth(getMonth(1), -5);
          expectOverspentLastMonth(getMonth(2), 0);
        });
      });

      describe('#getAvailableToBudget', function() {
        it('should cover overspending of previous month', function() {
          expectAvailable(getMonth(-1), 0);
          expectAvailable(getMonth(0), 0);
          expectAvailable(getMonth(1), -5);
          expectAvailable(getMonth(2), -5);
        });
      });
    });

    describe('Overspending over two months', function() {
      /*
       |  -2 |  -1 |  0  |  1  |
       |-----|-----|-----|-----|
       | s3  |  s7 |     |     |
       |=====|=====|=====|=====|
       |  0  |   0 |  -3 | -10 | Funds
       |  0  |  -3 |  -7 |   0 | Overspending last month
       |  0  |   0 |   0 |   0 | Budgeted this month
       |  0  |   0 |   0 |   0 | Budgeted in the future
       |=====|=====|=====|=====|
       |  0  |  -3 | -10 | -10 | Available to budget
       */
      it('should cover both overspending', function() {
        addOutflow(getMonth(-2), -3);
        addOutflow(getMonth(-1), -7);

        // Two month ago
        expectAvailableByCategoryIdForSelectedMonth(getMonth(-2), new Map([[category1.uuid, -3]]));
        expectFunds(getMonth(-2), 0);
        expectOverspentLastMonth(getMonth(-2), 0);
        expectAvailable(getMonth(-2), 0);

        // Last month
        expectAvailableByCategoryIdForSelectedMonth(getMonth(-1), new Map([[category1.uuid, -7]]));
        expectFunds(getMonth(-1), 0);
        expectOverspentLastMonth(getMonth(-1), -3);
        expectAvailable(getMonth(-1), -3);

        // This month
        expectAvailableByCategoryIdForSelectedMonth(getMonth(0), new Map([[category1.uuid, 0]]));
        expectFunds(getMonth(0), -3);
        expectOverspentLastMonth(getMonth(0), -7);
        expectAvailable(getMonth(0), -10);

        // Next month
        expectAvailableByCategoryIdForSelectedMonth(getMonth(1), new Map([[category1.uuid, 0]]));
        expectFunds(getMonth(1), -10);
        expectOverspentLastMonth(getMonth(1), 0);
        expectAvailable(getMonth(0), -10);
      });
    });

    describe('Unbudgeting', function() {
      /*
       |     |  x  |     |
       |-----|-----|-----|
       |     |  -3 |     |
       |=====|=====|=====|
       |  0  |   0 |   3 | Funds
       |  0  |   0 |  -3 | Overspending last month
       |  0  |   3 |   0 | Budgeted this month
       |  0  |   0 |   0 | Budgeted in the future
       |=====|=====|=====|
       |  0  |   3 |   0 | Available to budget
       */
      beforeEach(function() {
        budget(getMonth(), -3);
      });

      describe('#getAvailableByCategoryIdForSelectedMonth', function() {
        it('should not affect previous month', () =>
          expectAvailableByCategoryIdForSelectedMonth(
            getMonth(-1),
            new Map([[category1.uuid, 0]])
          ));
        it('should affect current month', () =>
          expectAvailableByCategoryIdForSelectedMonth(getMonth(), new Map([[category1.uuid, -3]])));
        it('should be reset to 0 in case of overbudgeting', () =>
          expectAvailableByCategoryIdForSelectedMonth(getMonth(1), new Map([[category1.uuid, 0]])));
      });

      describe('#getFundsForSelectedMonth', function() {
        it('should not affect previous month', () => expectFunds(getMonth(-1), 0));
        it('should not affect current month', () => expectFunds(getMonth(), 0));
        it('should be available next month', () => expectFunds(getMonth(1), 3));
      });

      describe('#getOverspentLastMonth', function() {
        it('should not affect previous month', () => expectOverspentLastMonth(getMonth(-1), 0));
        it('should not affect current month', () => expectOverspentLastMonth(getMonth(), 0));
        it('should be reflected next month', () => expectOverspentLastMonth(getMonth(1), -3));
      });

      describe('#getBudgetedThisMonth', function() {
        it('should not affect previous month', () => expectBudgetedThisMonth(getMonth(-1), 0));
        it('should affect current month', () => expectBudgetedThisMonth(getMonth(), 3));
        it('should not affect next month', () => expectBudgetedThisMonth(getMonth(1), 0));
      });

      describe('#getBudgetedInFuture', function() {
        it('should not affect previous month', () => expectBudgetedInFuture(getMonth(-1), 0));
        it('should not affect current month', () => expectBudgetedInFuture(getMonth(), 0));
        it('should not affect next month', () => expectBudgetedInFuture(getMonth(1), 0));
      });

      describe('#getAvailableToBudget', function() {
        it('should not affect previous month', () => expectAvailable(getMonth(-1), 0));
        it('should affect current month', () => expectAvailable(getMonth(), 3));
        it('should not affect next month', () => expectAvailable(getMonth(1), 0));
      });
    });
  });
}
