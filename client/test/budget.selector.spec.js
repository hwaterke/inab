/*eslint-env mocha*/
import expect from 'expect';
import reducer from '../src/reducers';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import * as utils from './utils';
import { getAvailableByCategoryIdForSelectedMonth, getFundsForSelectedMonth, getOverspentLastMonth, getAvailableToBudget } from '../src/selectors/budget';

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
    |  +5 |  +7 | +13 |
    |     |  50 |     |
    |=====|=====|=====|
    |  0  | -38 |     | Available to budget
    */
    beforeEach(function () {
      addInflow(getMonth(-1), 5);
      addInflow(getMonth(), 7);
      addInflow(getMonth(1), 13);
      budget(getMonth(), 50);
    });
    describe('#getAvailableToBudget', function () {
      it("Should account for future budgeting", () => expectAvailable(getMonth(-1), 0));
      it("Should account for budgetting in current month", () => expectAvailable(getMonth(), 5 + 7 - 50));
      it("Should account for previous budgeting", () => expectAvailable(getMonth(1), 5 + 7 - 50 + 13));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("should ignore future budgeting", () => expectFunds(getMonth(-1), 5));
      it("should ignore budgeting of the month", () => expectFunds(getMonth(), 5 + 7));
      it("should include past budgeting", () => expectFunds(getMonth(1), 5 + 7 - 50 + 13));
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
});
