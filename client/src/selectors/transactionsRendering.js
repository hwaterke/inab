import {createSelector} from 'reselect';
import {getSortedTransactions, getPayees} from './transactions';
import {getAccountsById} from './accounts';
import {getCategoriesById} from './categories';
import {mapMap} from './utils';

const getMirrorTransfer = (transaction) => {
  const mirror = Object.assign({}, transaction);
  mirror.id = mirror.id + 'r';
  mirror.account_id = transaction.transfer_account_id;
  mirror.transfer_account_id = transaction.account_id;
  mirror.account = transaction.payee;
  mirror.payee = transaction.account;
  mirror.amount = -mirror.amount;
  return mirror;
};

// Converts the transactions to TransactionView
export const getTransactionsForRendering = createSelector(
  getSortedTransactions,
  getAccountsById,
  getCategoriesById,
  (transactions, accountsById, categoriesById) => {
    const result = [];

    transactions.forEach(tr => {
      const tr_result = {
        ...tr,
        account: accountsById.get(tr.account_id).name,
        payee: tr.payee || tr.transfer_account_id && accountsById.get(tr.transfer_account_id).name,
        is_transfer: !!tr.transfer_account_id,
      };
      tr_result.display_date = tr.date;

      if (tr.type === 'to_be_budgeted') {
        tr_result.category = 'To be budgeted';
      }
      if (tr.type === 'split') {
        tr_result.category = 'Split';
      }
      if (tr.type === 'regular' && tr.category_id) {
        tr_result.category = categoriesById.get(tr.category_id).name;
      }

      result.push(tr_result);
      if (tr.transfer_account_id) {
        result.push(getMirrorTransfer(tr_result));
      }

      tr.subtransactions.forEach((str, strIndex) => {
        const str_result = {
          id: 's' + ((str.id) ? str.id : ('i' + strIndex)),
          date: tr.date,
          account_id: tr.account_id,
          category_id: str.category_id,
          category: str.category_id ? categoriesById.get(str.category_id).name : '',
          description: str.description,
          amount: str.amount,
          subtransaction: true,
          parent_transaction: tr.id
        };
        result.push(str_result);
      });
    });

    return result;
  }
);

export const getTransactionColumns = createSelector(
  getAccountsById,
  getCategoriesById,
  getPayees,
  (accountsById, categoriesById, payees) => ({
    account: {
      label: 'Account',
      type: 'text',
      options: mapMap(accountsById, a => a.name)
    },
    date: {
      label: 'Date',
      type: 'date',
    },
    category_id: {
      label: 'Category',
      type: 'text',
      options: mapMap(categoriesById, c => c.name)
    },
    amount: {
      label: 'Amount',
      type: 'number'
    },
    description: {
      label: 'Description',
      type: 'text'
    },
    payee: {
      label: 'Payee',
      type: 'text',
      options: payees
    }
  })
);
