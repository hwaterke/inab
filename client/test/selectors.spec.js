/*eslint-env mocha*/
import expect from 'expect';
import reducer from '../src/reducers';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { getAccounts, getAccountsById, getBalanceByAccountId } from '../src/selectors/accounts';
import { getBudgetItems, getSelectedMonthBudgetItems } from '../src/selectors/budgetItems';
import { getFundsForSelectedMonth } from '../src/selectors/budget';
import * as utils from './utils';

describe('Selectors', function() {
  let store;

  beforeEach(() => {
    store = createStore(reducer, applyMiddleware(thunk));
  });

  describe('Account selectors', function() {
    describe('#getAccounts', function() {
      it('should be empty by default', function() {
        const accounts = getAccounts(store.getState());
        expect(accounts).toEqual([]);
      });

      it('should return one account', function() {
        utils.createAccount(store, 1, "Checking");
        const accounts = getAccounts(store.getState());
        expect(accounts).toEqual([{id: 1, name: "Checking"}]);
      });

      it('should return two accounts', function() {
        utils.createAccount(store, 1, "Checking");
        utils.createAccount(store, 2, "Savings");
        const accounts = getAccounts(store.getState());
        expect(accounts).toEqual([{id: 1, name: "Checking"}, {id: 2, name: "Savings"}]);
      });
    });

    describe('#getAccountsById', function() {
      it('should be empty by default', function() {
        const accounts = getAccountsById(store.getState());
        expect(accounts).toEqual({});
      });

      it('should return one account', function() {
        utils.createAccount(store, 1, "Checking");
        const accounts = getAccountsById(store.getState());
        expect(accounts).toEqual({1: {id: 1, name: "Checking"}});
      });

      it('should return two accounts', function() {
        utils.createAccount(store, 1, "Checking");
        utils.createAccount(store, 2, "Savings");
        const accounts = getAccountsById(store.getState());
        expect(accounts).toEqual({
          1: {id: 1, name: "Checking"},
          2: {id: 2, name: "Savings"}
        });
      });
    });

    describe('#getBalanceByAccountId', function() {
      it('should be empty by default', function() {
        const accounts = getBalanceByAccountId(store.getState());
        expect(accounts).toEqual({});
      });

      it('should return 0 for one account', function() {
        utils.createAccount(store, 1, "Checking");
        const accounts = getBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 0});
      });

      it('should return 0 for two accounts', function() {
        utils.createAccount(store, 1, "Checking");
        utils.createAccount(store, 2, "Savings");
        const accounts = getBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 0, 2: 0});
      });

      it('should include one inflow', function() {
        utils.createAccount(store, 1, "Checking");
        utils.createAccount(store, 2, "Savings");
        utils.createInflowTBB(store, 1, 1, 100000, "2016-06-01");
        const accounts = getBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 100000, 2: 0});
      });

      it('should handle transfers', function() {
        utils.createAccount(store, 1, "Checking");
        utils.createAccount(store, 2, "Savings");
        utils.createInflowTBB(store, 1, 1, 100000, "2016-06-01");
        utils.createTransfer(store, 2, 1, 2, -50000, "2016-06-02");
        const accounts = getBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 50000, 2: 50000});
      });
    });

  });

  describe('Budget Item selectors', function() {
    describe('#getBudgetItems', function() {
      it('should be empty by default', function() {
        const bi = getBudgetItems(store.getState());
        expect(bi).toEqual([]);
      });

      it('should return one budget item', function() {
        utils.createBudgetItem(store, 1, "2016-06-01", 1, 10000);
        const bi = getBudgetItems(store.getState());
        expect(bi).toEqual([{id: 1, month: "2016-06-01", category_id: 1, amount: 10000}]);
      });
    });

    describe('#getSelectedMonthBudgetItems', function() {
      it('should be empty by default', function() {
        utils.selectMonth(store, 2016, 1);
        const bi = getSelectedMonthBudgetItems(store.getState());
        expect(bi).toEqual([]);
      });

      it('should be return one item from the selected month', function() {
        utils.selectMonth(store, 2016, 1);
        utils.createBudgetItem(store, 1, "2016-01-01", 1, 10000);
        const bi = getSelectedMonthBudgetItems(store.getState());
        expect(bi).toEqual([{id: 1, month: "2016-01-01", category_id: 1, amount: 10000}]);
      });

      it('should not return item from previous month', function() {
        utils.selectMonth(store, 2016, 2);
        utils.createBudgetItem(store, 1, "2016-01-01", 1, 10000);
        const bi = getSelectedMonthBudgetItems(store.getState());
        expect(bi).toEqual([]);
      });

      it('should not return item from next month', function() {
        utils.selectMonth(store, 2016, 1);
        utils.createBudgetItem(store, 1, "2016-02-01", 1, 10000);
        const bi = getSelectedMonthBudgetItems(store.getState());
        expect(bi).toEqual([]);
      });
    });
  });

  describe('Budget selectors', function() {
    describe('#getFundsForSelectedMonth', function() {
      it('should be 0 by default', function() {
        utils.selectMonth(store, 2016, 1);
        const bi = getFundsForSelectedMonth(store.getState());
        expect(bi).toEqual(0);
      });

      it('should use inflow of this month and previous month', function() {
        utils.createAccount(store, 1, "Checking");
        utils.selectMonth(store, 2016, 6);
        utils.createInflowTBB(store, 1, 1, 300, "2016-05-01");
        utils.createInflowTBB(store, 2, 1, 200, "2016-06-01");
        utils.createInflowTBB(store, 3, 1, 700, "2016-07-01");
        const bi = getFundsForSelectedMonth(store.getState());
        expect(bi).toEqual(500);
      });

      it('should reflect budget items of previous month', function() {
        utils.createAccount(store, 1, "Checking");
        utils.selectMonth(store, 2016, 6);
        utils.createInflowTBB(store, 2, 1, 7, "2016-06-01");
        utils.createBudgetItem(store, 1, "2016-05-01", 1, 5);
        const bi = getFundsForSelectedMonth(store.getState());
        expect(bi).toEqual(2);
      });

      it('should not reflect budget items of this month', function() {
        utils.createAccount(store, 1, "Checking");
        utils.selectMonth(store, 2016, 6);
        utils.createInflowTBB(store, 2, 1, 7, "2016-06-01");
        utils.createBudgetItem(store, 1, "2016-06-01", 1, 5);
        const bi = getFundsForSelectedMonth(store.getState());
        expect(bi).toEqual(7);
      });

      it('should reflect over budgeting', function() {
        utils.createAccount(store, 1, "Checking");
        utils.selectMonth(store, 2016, 6);
        utils.createInflowTBB(store, 2, 1, 7, "2016-06-01");
        utils.createBudgetItem(store, 1, "2016-05-01", 1, 11);
        const bi = getFundsForSelectedMonth(store.getState());
        expect(bi).toEqual(-4);
      });
    });
  });
});
