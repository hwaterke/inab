import {createSelector} from 'reselect';
import {getTransactions} from './transactions';
import {createMappingSelector} from './utils';

// All
export const getAccounts = state => state.accounts;

// Grouping
export const getAccountsById = createMappingSelector(getAccounts, 'uuid');

export const getBalanceByAccountId = createSelector(
  getAccounts,
  getTransactions,
  (accounts, transactions) => {
    const result = new Map();
    accounts.forEach((a) => result.set(a.uuid, 0));
    transactions.forEach(function (t) {
      result.set(t.account_uuid, result.get(t.account_uuid) + t.amount);
      if (t.transfer_account_uuid) {
        result.set(t.transfer_account_uuid, result.get(t.transfer_account_uuid) - t.amount);
      }
    });
    return result;
  }
);
