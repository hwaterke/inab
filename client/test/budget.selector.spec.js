/*eslint-env mocha*/
import expect from 'expect';
import reducer from '../src/reducers';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import * as utils from './utils';
import { getFundsForSelectedMonth, getAvailableToBudget } from '../src/selectors/budget';

describe('Budget Selectors', function() {
  let store;
  let nextId;

  const currentMonth = () => 6;
  const previousMonth = () => currentMonth() - 1;
  const nextMonth = () => currentMonth() + 1;
  const monthString = (month) => `2016-0${month}-01`;

  const addInflow = (month, amount) => utils.createInflowTBB(store, nextId++, 1, amount, monthString(month));

  const budget = (month, amount) => utils.createBudgetItem(store, nextId++, monthString(month), 1, amount);

  const expectAvailable = (month, amount) => {
    utils.selectMonth(store, 2016, month);
    expect(getAvailableToBudget(store.getState())).toEqual(amount);
  };

  const expectFunds = (month, amount) => {
    utils.selectMonth(store, 2016, month);
    expect(getFundsForSelectedMonth(store.getState())).toEqual(amount);
  };

  beforeEach(() => {
    nextId = 1;
    store = createStore(reducer, applyMiddleware(thunk));
    utils.createAccount(store, 1, "Checking");
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
      it("Should be 0 for previous month", () => expectAvailable(previousMonth(), 0));
      it("Should be 0 for current month", () => expectAvailable(currentMonth(), 0));
      it("Should be 0 for next month", () => expectAvailable(nextMonth(), 0));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("Should be 0 for previous month", () => expectFunds(previousMonth(), 0));
      it("Should be 0 for current month", () => expectFunds(currentMonth(), 0));
      it("Should be 0 for next month", () => expectFunds(nextMonth(), 0));
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
      addInflow(currentMonth(), 3);
    });
    describe('#getAvailableToBudget', function () {
      it("Should ignore inflow of next month", () => expectAvailable(previousMonth(), 0));
      it("Should include inflow of current month", () => expectAvailable(currentMonth(), 3));
      it("Should include left over from last month", () => expectAvailable(nextMonth(), 3));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("Should ignore inflow of next month", () => expectFunds(previousMonth(), 0));
      it("Should include inflow of current month", () => expectFunds(currentMonth(), 3));
      it("Should include left over from last month", () => expectFunds(nextMonth(), 3));
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
      addInflow(previousMonth(), 3);
      addInflow(currentMonth(), 5);
      addInflow(nextMonth(), 7);
    });
    describe('#getAvailableToBudget', function () {
      it("Should ignore inflow of next months", () => expectAvailable(previousMonth(), 3));
      it("Should combine inflow of current and previous month", () => expectAvailable(currentMonth(), 8));
      it("Should combine inflows over one month", () => expectAvailable(nextMonth(), 15));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("Should ignore inflow of next month", () => expectFunds(previousMonth(), 3));
      it("Should combine inflow of current and previous month", () => expectFunds(currentMonth(), 8));
      it("Should combine inflows over one month", () => expectFunds(nextMonth(), 15));
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
      addInflow(previousMonth(), 5);
      addInflow(currentMonth(), 7);
      addInflow(nextMonth(), 13);
      budget(currentMonth(), 3);
    });
    describe('#getAvailableToBudget', function () {
      it("Should account for future budgeting", () => expectAvailable(previousMonth(), 2));
      it("Should account for budgetting in current month", () => expectAvailable(currentMonth(), 9));
      it("Should account for previous budgeting", () => expectAvailable(nextMonth(), 22));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("should ignore future budgeting", () => expectFunds(previousMonth(), 5));
      it("should ignore budgeting of the month", () => expectFunds(currentMonth(), 5 + 7));
      it("should include past budgeting", () => expectFunds(nextMonth(), 5 + 7 - 3 + 13));
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
      addInflow(previousMonth(), 5);
      addInflow(currentMonth(), 7);
      addInflow(nextMonth(), 13);
      budget(currentMonth(), 5);
    });
    describe('#getAvailableToBudget', function () {
      it("Should account for future budgeting", () => expectAvailable(previousMonth(), 0));
      it("Should account for budgetting in current month", () => expectAvailable(currentMonth(), 7));
      it("Should account for previous budgeting", () => expectAvailable(nextMonth(), 20));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("should ignore future budgeting", () => expectFunds(previousMonth(), 5));
      it("should ignore budgeting of the month", () => expectFunds(currentMonth(), 5 + 7));
      it("should include past budgeting", () => expectFunds(nextMonth(), 5 + 7 - 5 + 13));
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
      addInflow(previousMonth(), 5);
      addInflow(currentMonth(), 7);
      addInflow(nextMonth(), 13);
      budget(currentMonth(), 8);
    });
    describe('#getAvailableToBudget', function () {
      it("Should account for future budgeting", () => expectAvailable(previousMonth(), 0));
      it("Should account for budgetting in current month", () => expectAvailable(currentMonth(), 4));
      it("Should account for previous budgeting", () => expectAvailable(nextMonth(), 17));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("should ignore future budgeting", () => expectFunds(previousMonth(), 5));
      it("should ignore budgeting of the month", () => expectFunds(currentMonth(), 5 + 7));
      it("should include past budgeting", () => expectFunds(nextMonth(), 5 + 7 - 8 + 13));
    });
  });

  describe('Over budgeting', function() {
    /*
    |     |  x  |     |
    |-----|-----|-----|
    |  +5 |  +7 | +13 |
    |     |  50 |     |
    |=====|=====|=====|
    |  0  | -38 |  17 | Available to budget
    */
    beforeEach(function () {
      addInflow(previousMonth(), 5);
      addInflow(currentMonth(), 7);
      addInflow(nextMonth(), 13);
      budget(currentMonth(), 50);
    });
    describe('#getAvailableToBudget', function () {
      it("Should account for future budgeting", () => expectAvailable(previousMonth(), 0));
      it("Should account for budgetting in current month", () => expectAvailable(currentMonth(), 5 + 7 - 50));
      it("Should account for previous budgeting", () => expectAvailable(nextMonth(), 5 + 7 - 50 + 13));
    });
    describe('#getFundsForSelectedMonth', function () {
      it("should ignore future budgeting", () => expectFunds(previousMonth(), 5));
      it("should ignore budgeting of the month", () => expectFunds(currentMonth(), 5 + 7));
      it("should include past budgeting", () => expectFunds(nextMonth(), 5 + 7 - 50 + 13));
    });
  });
});
