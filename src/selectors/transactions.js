// @flow
import {createSelector} from 'reselect';
import {byIdSelector} from 'hw-react-shared';
import type {Account, Category, Transaction} from 'inab-shared';
import {
  getSortedTransactions,
  AccountResource,
  CategoryResource
} from 'inab-shared';

const getMirrorTransfer = transaction => {
  const mirror = {...transaction};
  mirror.key = mirror.uuid + 'r';
  mirror.account_uuid = transaction.transfer_account_uuid;
  mirror.transfer_account_uuid = transaction.account_uuid;
  mirror.accountName = transaction.transferAccountName;
  mirror.transferAccountName = transaction.accountName;
  mirror.amount = -mirror.amount;
  return mirror;
};

export const getTransactionForRendering = createSelector(
  getSortedTransactions,
  byIdSelector(AccountResource),
  byIdSelector(CategoryResource),
  (
    transactions: Transaction[],
    accountsById: {[string]: Account},
    categoriesById: {[string]: Category}
  ) => {
    const result = [];

    transactions.forEach(tr => {
      const trResult = {...tr, key: tr.uuid};

      if (tr.type === 'to_be_budgeted') {
        trResult.categoryName = 'To be budgeted';
      }
      if (tr.type === 'split') {
        trResult.categoryName = 'Split';
      }
      if (tr.type === 'regular' && tr.category_uuid) {
        trResult.categoryName = categoriesById[tr.category_uuid].name;
      }

      trResult.accountName = accountsById[tr.account_uuid].name;

      if (tr.transfer_account_uuid) {
        trResult.isTransfer = true;
        trResult.transferAccountName =
          accountsById[tr.transfer_account_uuid].name;
      }

      result.push(trResult);
      if (tr.transfer_account_uuid) {
        result.push(getMirrorTransfer(trResult));
      }
    });

    return result;
  }
);
