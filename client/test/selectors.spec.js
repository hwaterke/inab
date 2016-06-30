/*eslint-env mocha*/
import expect from 'expect';
import reducer from '../src/reducers';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { getAccounts, getAccountsById, getBalanceByAccountId } from '../src/selectors/accounts';
import { getBudgetItems } from '../src/selectors/budgetItems';
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
  });
});
