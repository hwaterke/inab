import { createSelector } from 'reselect';
import { getTransactions } from './transactions';

export const getAccounts = state => state.accounts;

export const getAccountsById = createSelector(
  getAccounts,
  accounts => {
    const result = {};
    accounts.forEach(function (a) {
      result[a.id] = a;
    });
    return result;
  }
);

export const getBalanceByAccountId = createSelector(
  getAccounts,
  getTransactions,
  (accounts, transactions) => {
    const result = {};
    accounts.forEach(function (a) {
      result[a.id] = 0;
    });
    transactions.forEach(function (t) {
      result[t.account_id] = result[t.account_id] || 0;
      result[t.account_id] += t.amount;
      if (t.transfer_account_id) {
        result[t.transfer_account_id] = result[t.transfer_account_id] || 0;
        result[t.transfer_account_id] -= t.amount;
      }
    });
    return result;
  }
);
