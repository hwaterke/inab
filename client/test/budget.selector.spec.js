/*eslint-env mocha*/
import expect from 'expect';
import reducer from '../src/reducers';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import * as utils from './utils';
import { getAvailableByCategoryIdForSelectedMonth, getFundsForSelectedMonth, getOverspentLastMonth, getBudgetedThisMonth, getBudgetedInFuture, getAvailableToBudget } from '../src/selectors/budget';

describe('Budget Selectors', function() {
  let store;
  let nextId;

  const getMonth = (delta = 0) => 6 + delta;
  const monthString = (month) => `2016-0${month}-01`;

  const addInflow = (month, amount) => utils.createInflowTBB(store, nextId++, 1, amount, monthString(month));
  const addOutflow = (month, amount) => utils.createOutflow(store, nextId++, 1, amount, 1, monthString(month));

  const budget = (month, amount) => utils.createBudgetItem(store, nextId++, monthString(month), 1, amount);

  const expectAvailableByCategoryIdForSelectedMonth = (month, value) => {
    utils.selectMonth(store, 2016, month);
    expect(getAvailableByCategoryIdForSelectedMonth(store.getState())).toEqual(value);
  };

  const expectAvailable = (month, amount) => {
    utils.selectMonth(store, 2016, month);
    expect(getAvailableToBudget(store.getState())).toEqual(amount);
  };

  const expectFunds = (month, amount) => {
    utils.selectMonth(store, 2016, month);
    expect(getFundsForSelectedMonth(store.getState())).toEqual(amount);
  };

  const expectOverspentLastMonth = (month, amount) => {
    utils.selectMonth(store, 2016, month);
    expect(getOverspentLastMonth(store.getState())).toEqual(amount);
  };

  const expectBudgetedThisMonth = (month, amount) => {
    utils.selectMonth(store, 2016, month);
    expect(getBudgetedThisMonth(store.getState())).toEqual(amount);
  };

  const expectBudgetedInFuture = (month, amount) => {
    utils.selectMonth(store, 2016, month);
    expect(getBudgetedInFuture(store.getState())).toEqual(amount);
  };

  beforeEach(() => {
    nextId = 1;
    store = createStore(reducer, applyMiddleware(thunk));
    utils.createAccount(store, 1, "Checking");
    utils.createCategory(store, 1, "Category");
  });

  describe('Handle default state', function() {
    /*
    |     |  x  |     |
    |-----|-----|-----|
    |     |     |     |
    |=====|=====|=====|
    |  0  |  0  |  0  | Available to budget
    */
    describe('#getAvailableToBudget', function () {
      it("Should be 0 for previous month", () => expectAvailable(getMonth(-1), 0));
      it("Should be 0 for current month", () => expectAvailable(getMonth(), 0));
      it("Should be 0 for next month", () => expectAvailable(getMonth(1), 0));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("Should be 0 for previous month", () => expectFunds(getMonth(-1), 0));
      it("Should be 0 for current month", () => expectFunds(getMonth(), 0));
      it("Should be 0 for next month", () => expectFunds(getMonth(1), 0));
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
    beforeEach(function () {
      addInflow(getMonth(), 3);
    });
    describe('#getAvailableToBudget', function () {
      it("Should ignore inflow of next month", () => expectAvailable(getMonth(-1), 0));
      it("Should include inflow of current month", () => expectAvailable(getMonth(), 3));
      it("Should include left over from last month", () => expectAvailable(getMonth(1), 3));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("Should ignore inflow of next month", () => expectFunds(getMonth(-1), 0));
      it("Should include inflow of current month", () => expectFunds(getMonth(), 3));
      it("Should include left over from last month", () => expectFunds(getMonth(1), 3));
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
    beforeEach(function () {
      addInflow(getMonth(-1), 3);
      addInflow(getMonth(), 5);
      addInflow(getMonth(1), 7);
    });
    describe('#getAvailableToBudget', function () {
      it("Should ignore inflow of next months", () => expectAvailable(getMonth(-1), 3));
      it("Should combine inflow of current and previous month", () => expectAvailable(getMonth(), 8));
      it("Should combine inflows over one month", () => expectAvailable(getMonth(1), 15));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("Should ignore inflow of next month", () => expectFunds(getMonth(-1), 3));
      it("Should combine inflow of current and previous month", () => expectFunds(getMonth(), 8));
      it("Should combine inflows over one month", () => expectFunds(getMonth(1), 15));
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
    beforeEach(function () {
      addInflow(getMonth(-1), 5);
      addInflow(getMonth(), 7);
      addInflow(getMonth(1), 13);
      budget(getMonth(), 3);
    });
    describe('#getAvailableToBudget', function () {
      it("Should account for future budgeting", () => expectAvailable(getMonth(-1), 2));
      it("Should account for budgetting in current month", () => expectAvailable(getMonth(), 9));
      it("Should account for previous budgeting", () => expectAvailable(getMonth(1), 22));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("should ignore future budgeting", () => expectFunds(getMonth(-1), 5));
      it("should ignore budgeting of the month", () => expectFunds(getMonth(), 5 + 7));
      it("should include past budgeting", () => expectFunds(getMonth(1), 5 + 7 - 3 + 13));
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
    beforeEach(function () {
      addInflow(getMonth(-1), 5);
      addInflow(getMonth(), 7);
      addInflow(getMonth(1), 13);
      budget(getMonth(), 5);
    });
    describe('#getAvailableToBudget', function () {
      it("Should account for future budgeting", () => expectAvailable(getMonth(-1), 0));
      it("Should account for budgetting in current month", () => expectAvailable(getMonth(), 7));
      it("Should account for previous budgeting", () => expectAvailable(getMonth(1), 20));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("should ignore future budgeting", () => expectFunds(getMonth(-1), 5));
      it("should ignore budgeting of the month", () => expectFunds(getMonth(), 5 + 7));
      it("should include past budgeting", () => expectFunds(getMonth(1), 5 + 7 - 5 + 13));
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
    beforeEach(function () {
      addInflow(getMonth(-1), 5);
      addInflow(getMonth(), 7);
      addInflow(getMonth(1), 13);
      budget(getMonth(), 8);
    });
    describe('#getAvailableToBudget', function () {
      it("Should account for future budgeting", () => expectAvailable(getMonth(-1), 0));
      it("Should account for budgetting in current month", () => expectAvailable(getMonth(), 4));
      it("Should account for previous budgeting", () => expectAvailable(getMonth(1), 17));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("should ignore future budgeting", () => expectFunds(getMonth(-1), 5));
      it("should ignore budgeting of the month", () => expectFunds(getMonth(), 5 + 7));
      it("should include past budgeting", () => expectFunds(getMonth(1), 5 + 7 - 8 + 13));
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
    beforeEach(function () {
      addInflow(getMonth(-1), 3);
      addInflow(getMonth(), 5);
      addInflow(getMonth(1), 7);
      budget(getMonth(), 50);
    });

    describe('#getAvailableByCategoryIdForSelectedMonth', function () {
      it('should not affect previous month', () => expectAvailableByCategoryIdForSelectedMonth(getMonth(-1), new Map([[1, 0]])));
      it('should affect current month', () => expectAvailableByCategoryIdForSelectedMonth(getMonth(), new Map([[1, 50]])));
      it('should affect next month', () => expectAvailableByCategoryIdForSelectedMonth(getMonth(1), new Map([[1, 50]])));
    });

    describe('#getFundsForSelectedMonth', function () {
      it('should not affect previous month', () => expectFunds(getMonth(-1), 3));
      it('should not affect current month', () => expectFunds(getMonth(), 8));
      it('should be available next month', () => expectFunds(getMonth(1), -35));
    });

    describe('#getOverspentLastMonth', function () {
      it('should not affect previous month', () => expectOverspentLastMonth(getMonth(-1), 0));
      it('should not affect current month', () => expectOverspentLastMonth(getMonth(), 0));
      it('should not affect next month', () => expectOverspentLastMonth(getMonth(1), 0));
    });

    describe('#getBudgetedThisMonth', function () {
      it('should not affect previous month', () => expectBudgetedThisMonth(getMonth(-1), 0));
      it('should affect current month', () => expectBudgetedThisMonth(getMonth(), -50));
      it('should not affect next month', () => expectBudgetedThisMonth(getMonth(1), 0));
    });

    describe('#getBudgetedInFuture', function () {
      it('should affect previous month', () => expectBudgetedInFuture(getMonth(-1), -3));
      it('should not affect current month', () => expectBudgetedInFuture(getMonth(), 0));
      it('should not affect next month', () => expectBudgetedInFuture(getMonth(1), 0));
    });

    describe('#getAvailableToBudget', function () {
      it("should account for the budgeting", () => {
        expectAvailable(getMonth(-1), 0);
        expectAvailable(getMonth(), -42);
        expectAvailable(getMonth(1), -35);
      });
    });
  });

  describe('Overspending', function () {
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
    beforeEach(function () {
      addOutflow(getMonth(), -5);
    });

    describe('#getAvailableByCategoryIdForSelectedMonth', function () {
      it('should be default without transactions', () => expectAvailableByCategoryIdForSelectedMonth(getMonth(-1), new Map([[1, 0]])));
      it('should take transactions of this month into account', () => expectAvailableByCategoryIdForSelectedMonth(getMonth(), new Map([[1, -5]])));
      it('should be reset to 0 in case of overspending', () => expectAvailableByCategoryIdForSelectedMonth(getMonth(1), new Map([[1, 0]])));
      it('should be stay reset to 0 in case of overspending', () => expectAvailableByCategoryIdForSelectedMonth(getMonth(2), new Map([[1, 0]])));
    });

    describe('#getFundsForSelectedMonth', function () {
      it('should be default in previous month', () => expectFunds(getMonth(-1), 0));
      it('should not be affected by current month overspending', () => expectFunds(getMonth(), 0));
      it('should not be affected by previous oversepnding', () => expectFunds(getMonth(1), 0));
      it('should be affected by oversepnding of couple month ago', () => expectFunds(getMonth(2), -5));
    });

    describe('#getOverspentLastMonth', function () {
      it('should only affect month after spending', function () {
        expectOverspentLastMonth(getMonth(-1), 0);
        expectOverspentLastMonth(getMonth(), 0);
        expectOverspentLastMonth(getMonth(1), -5);
        expectOverspentLastMonth(getMonth(2), 0);
      });
    });

    describe('#getAvailableToBudget', function () {
      it("should cover overspending of previous month", function () {
        expectAvailable(getMonth(1), -5);
      });
    });
  });

  describe('Unbudgeting', function () {
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
    beforeEach(function () {
      budget(getMonth(), -3);
    });

    describe('#getAvailableByCategoryIdForSelectedMonth', function () {
      it('should not affect previous month', () => expectAvailableByCategoryIdForSelectedMonth(getMonth(-1), new Map([[1, 0]])));
      it('should affect current month', () => expectAvailableByCategoryIdForSelectedMonth(getMonth(), new Map([[1, -3]])));
      it('should be reset to 0 in case of overbudgeting', () => expectAvailableByCategoryIdForSelectedMonth(getMonth(1), new Map([[1, 0]])));
    });

    describe('#getFundsForSelectedMonth', function () {
      it('should not affect previous month', () => expectFunds(getMonth(-1), 0));
      it('should not affect current month', () => expectFunds(getMonth(), 0));
      it('should be available next month', () => expectFunds(getMonth(1), 3));
    });

    describe('#getOverspentLastMonth', function () {
      it('should not affect previous month', () => expectOverspentLastMonth(getMonth(-1), 0));
      it('should not affect current month', () => expectOverspentLastMonth(getMonth(), 0));
      it('should be reflected next month', () => expectOverspentLastMonth(getMonth(1), -3));
    });

    describe('#getBudgetedThisMonth', function () {
      it('should not affect previous month', () => expectBudgetedThisMonth(getMonth(-1), 0));
      it('should affect current month', () => expectBudgetedThisMonth(getMonth(), 3));
      it('should not affect next month', () => expectBudgetedThisMonth(getMonth(1), 0));
    });

    describe('#getBudgetedInFuture', function () {
      it('should not affect previous month', () => expectBudgetedInFuture(getMonth(-1), 0));
      it('should not affect current month', () => expectBudgetedInFuture(getMonth(), 0));
      it('should not affect next month', () => expectBudgetedInFuture(getMonth(1), 0));
    });

    describe('#getAvailableToBudget', function () {
      it('should not affect previous month', () => expectAvailable(getMonth(-1), 0));
      it('should affect current month', () => expectAvailable(getMonth(), 3));
      it('should not affect next month', () => expectAvailable(getMonth(1), 0));
    });
  });
});
