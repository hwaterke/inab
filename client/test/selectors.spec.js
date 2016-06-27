import expect from 'expect';
import reducer from '../src/reducers';
import reduxCrud from 'redux-crud';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { getAccounts, getAccountsById, getBalanceByAccountId } from '../src/selectors/accounts';

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
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 1, name: "Checking"}));
        const accounts = getAccounts(store.getState());
        expect(accounts).toEqual([{id: 1, name: "Checking"}]);
      });

      it('should return two accounts', function() {
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 1, name: "Checking"}));
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 2, name: "Savings"}));
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
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 1, name: "Checking"}));
        const accounts = getAccountsById(store.getState());
        expect(accounts).toEqual({1: {id: 1, name: "Checking"}});
      });

      it('should return two accounts', function() {
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 1, name: "Checking"}));
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 2, name: "Savings"}));
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
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 1, name: "Checking"}));
        const accounts = getBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 0});
      });

      it('should return 0 for two accounts', function() {
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 1, name: "Checking"}));
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 2, name: "Savings"}));
        const accounts = getBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 0, 2: 0});
      });

      it('should include one inflow', function() {
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 1, name: "Checking"}));
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 2, name: "Savings"}));
        store.dispatch(reduxCrud.actionCreatorsFor('transactions').createSuccess({
          id: 1,
          account_id: 1,
          amount: 100000,
          category_id: null,
          date: "2016-06-01",
          description: null,
          inflow_to_be_budgeted: true,
          payee: "Payee",
          transfer_account_id: null
        }));
        const accounts = getBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 100000, 2: 0});
      });

      it('should handle transfers', function() {
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 1, name: "Checking"}));
        store.dispatch(reduxCrud.actionCreatorsFor('accounts').createSuccess({id: 2, name: "Savings"}));
        store.dispatch(reduxCrud.actionCreatorsFor('transactions').createSuccess({
          id: 1,
          account_id: 1,
          amount: 100000,
          category_id: null,
          date: "2016-06-01",
          description: null,
          inflow_to_be_budgeted: true,
          payee: "Payee",
          transfer_account_id: null
        }));
        store.dispatch(reduxCrud.actionCreatorsFor('transactions').createSuccess({
          id: 2,
          account_id: 1,
          amount: -50000,
          category_id: 1,
          date: "2016-06-01",
          description: null,
          inflow_to_be_budgeted: false,
          payee: null,
          transfer_account_id: 2
        }));
        const accounts = getBalanceByAccountId(store.getState());
        expect(accounts).toEqual({1: 50000, 2: 50000});
      });
    });

  });
});
