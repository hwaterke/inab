/*eslint-env mocha*/
import expect from 'expect';
import reducer from '../src/reducers';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {getAccounts, getAccountsById, getBalanceByAccountId} from '../src/selectors/accounts';
import * as budgetItemsSelectors from '../src/selectors/budgetItems';
import * as transactionsSelectors from '../src/selectors/transactions';
import * as utils from './utils';

describe('Selectors', function () {
  let store;

  beforeEach(() => {
    store = createStore(reducer, applyMiddleware(thunk));
  });

  describe('Account selectors', function () {
    describe('#getAccounts', function () {
      it('should be empty by default', function () {
        const accounts = getAccounts(store.getState());
        expect(accounts).toEqual([]);
      });

      it('should return one account', function () {
        utils.createAccount(store, 1, 'Checking');
        const accounts = getAccounts(store.getState());
        expect(accounts).toEqual([{uuid: 1, name: 'Checking'}]);
      });

      it('should return two accounts', function () {
        utils.createAccount(store, 1, 'Checking');
        utils.createAccount(store, 2, 'Savings');
        const accounts = getAccounts(store.getState());
        expect(accounts).toEqual([{uuid: 1, name: 'Checking'}, {uuid: 2, name: 'Savings'}]);
      });
    });

    describe('#getAccountsById', function () {
      it('should be empty by default', function () {
        const accounts = getAccountsById(store.getState());
        expect(accounts).toEqual(new Map());
      });

      it('should return one account', function () {
        utils.createAccount(store, 1, 'Checking');
        const accounts = getAccountsById(store.getState());
        const expected = new Map();
        expected.set(1, {uuid: 1, name: 'Checking'});
        expect(accounts).toEqual(expected);
      });

      it('should return two accounts', function () {
        utils.createAccount(store, 1, 'Checking');
        utils.createAccount(store, 2, 'Savings');
        const accounts = getAccountsById(store.getState());
        const expected = new Map();
        expected.set(1, {uuid: 1, name: 'Checking'});
        expected.set(2, {uuid: 2, name: 'Savings'});
        expect(accounts).toEqual(expected);
      });
    });

    describe('#getBalanceByAccountId', function () {
      it('should be empty by default', function () {
        const accounts = getBalanceByAccountId(store.getState());
        expect(accounts).toEqual(new Map());
      });

      it('should return 0 for one account', function () {
        utils.createAccount(store, 1, 'Checking');
        const accounts = getBalanceByAccountId(store.getState());
        const expected = new Map();
        expected.set(1, 0);
        expect(accounts).toEqual(expected);
      });

      it('should return 0 for two accounts', function () {
        utils.createAccount(store, 1, 'Checking');
        utils.createAccount(store, 2, 'Savings');
        const accounts = getBalanceByAccountId(store.getState());
        const expected = new Map();
        expected.set(1, 0);
        expected.set(2, 0);
        expect(accounts).toEqual(expected);
      });

      it('should include one inflow', function () {
        utils.createAccount(store, 1, 'Checking');
        utils.createAccount(store, 2, 'Savings');
        utils.createInflowTBB(store, 1, 1, 100000, '2016-06-01');
        const accounts = getBalanceByAccountId(store.getState());
        const expected = new Map();
        expected.set(1, 100000);
        expected.set(2, 0);
        expect(accounts).toEqual(expected);
      });

      it('should handle transfers', function () {
        utils.createAccount(store, 1, 'Checking');
        utils.createAccount(store, 2, 'Savings');
        utils.createInflowTBB(store, 1, 1, 100000, '2016-06-01');
        utils.createTransfer(store, 2, 1, 2, -50000, '2016-06-02');
        const accounts = getBalanceByAccountId(store.getState());
        const expected = new Map();
        expected.set(1, 50000);
        expected.set(2, 50000);
        expect(accounts).toEqual(expected);
      });
    });

  });

  describe('Budget Item selectors', function () {

    beforeEach(() => {
      utils.selectMonth(store, 2016, 6);
    });

    describe('#getBudgetItems', function () {
      it('should be empty by default', function () {
        const bi = budgetItemsSelectors.getBudgetItems(store.getState());
        expect(bi).toEqual([]);
      });

      it('should return one budget item', function () {
        utils.createBudgetItem(store, 1, '2016-06-01', 1, 10000);
        const bi = budgetItemsSelectors.getBudgetItems(store.getState());
        expect(bi).toEqual([{uuid: 1, month: '2016-06-01', category_uuid: 1, amount: 10000}]);
      });
    });

    describe('#getSelectedMonthBudgetItems', function () {
      it('should be empty by default', function () {
        const bi = budgetItemsSelectors.inMonth.current(store.getState());
        expect(bi).toEqual([]);
      });

      it('should return one item from the selected month', function () {
        utils.createBudgetItem(store, 1, '2016-06-01', 1, 10000);
        const bi = budgetItemsSelectors.inMonth.current(store.getState());
        expect(bi).toEqual([{uuid: 1, month: '2016-06-01', category_uuid: 1, amount: 10000}]);
      });

      it('should not return item from previous month', function () {
        utils.createBudgetItem(store, 1, '2016-05-01', 1, 10000);
        const bi = budgetItemsSelectors.inMonth.current(store.getState());
        expect(bi).toEqual([]);
      });

      it('should not return item from next month', function () {
        utils.createBudgetItem(store, 1, '2016-07-01', 1, 10000);
        const bi = budgetItemsSelectors.inMonth.current(store.getState());
        expect(bi).toEqual([]);
      });
    });

    describe('#getSelectedMonthBudgetItemsByCategoryId', function () {
      it('should be empty by default', function () {
        const bi = budgetItemsSelectors.getSelectedMonthBudgetItemsByCategoryId(store.getState());
        expect(bi).toEqual(new Map());
      });

      it('should group by categories', function () {
        utils.createBudgetItem(store, 1, '2016-05-01', 1, 10000);
        utils.createBudgetItem(store, 2, '2016-06-01', 1, 10000);
        utils.createBudgetItem(store, 3, '2016-06-01', 2, 10000);
        utils.createBudgetItem(store, 4, '2016-07-01', 1, 10000);
        const bi = budgetItemsSelectors.getSelectedMonthBudgetItemsByCategoryId(store.getState());
        const expected = new Map();
        expected.set(1, {amount: 10000, category_uuid: 1, uuid: 2, month: '2016-06-01'});
        expected.set(2, {amount: 10000, category_uuid: 2, uuid: 3, month: '2016-06-01'});
        expect(bi).toEqual(expected);
      });
    });
  });

  describe('Transaction selectors', function () {

    beforeEach(() => {
      utils.selectMonth(store, 2016, 6);
    });

    it('should select transaction up to selected month', function () {
      utils.createInflowTBB(store, 1, 1, 3, '2016-05-05');
      utils.createInflowTBB(store, 2, 1, 5, '2016-06-06');
      utils.createInflowTBB(store, 3, 1, 7, '2016-07-07');
      const items = transactionsSelectors.upToMonth.current(store.getState());
      expect(items).toEqual([
        {
          account_uuid: 1,
          amount: 3,
          category_uuid: null,
          date: '2016-05-05',
          description: null,
          uuid: 1,
          payee: 'Payee',
          transfer_account_uuid: null,
          type: 'to_be_budgeted',
          subtransactions: []
        },
        {
          account_uuid: 1,
          amount: 5,
          category_uuid: null,
          date: '2016-06-06',
          description: null,
          uuid: 2,
          payee: 'Payee',
          transfer_account_uuid: null,
          type: 'to_be_budgeted',
          subtransactions: []
        }
      ]);
    });
  });
});
