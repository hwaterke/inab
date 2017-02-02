import {createSelector} from 'reselect';
import {getTransactions} from './transactions';
import {createMappingSelector} from './utils';

// All
export const getAccounts = state => state.accounts;

// Grouping
export const getAccountsById = createMappingSelector(getAccounts, 'id');

export const getBalanceByAccountId = createSelector(
  getAccounts,
  getTransactions,
  (accounts, transactions) => {
    const result = new Map();
    accounts.forEach((a) => result.set(a.id, 0));
    transactions.forEach(function (t) {
      result.set(t.account_id, result.get(t.account_id) + t.amount);
      if (t.transfer_account_id) {
        result.set(t.transfer_account_id, result.get(t.transfer_account_id) - t.amount);
      }
    });
    return result;
  }
);
