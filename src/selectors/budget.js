// @flow
import R from 'ramda';
import {createSelector} from 'reselect';
import {arraySelector} from 'hw-react-shared';
import type {Transaction} from '../entities/Transaction';
import {TransactionResource} from '../entities/Transaction';
import {sumOfAmounts} from './utils';
import type {Account} from '../entities/Account';
import {AccountResource} from '../entities/Account';

/**
 * Returns the balance of the budget i.e. the total amount of money across accounts.
 */
export const getBudgetBalance = createSelector(
  arraySelector(TransactionResource),
  (transactions: Transaction[]) => sumOfAmounts(transactions.filter(t => !t.transfer_account_uuid))
);

/**
 * Returns the balance per account
 */
export const selectBalanceByAccountId = createSelector(
  arraySelector(AccountResource),
  arraySelector(TransactionResource),
  (accounts: Account[], transactions: Transaction[]) => {
    const withTransferAccount = R.filter(R.prop('transfer_account_uuid'));
    const reduceToAmountSumBy = R.reduceBy((acc, record) => acc + record.amount, 0);
    const sumByAccountId = reduceToAmountSumBy(R.prop('account_uuid'));
    const sumByTransferAccountId = reduceToAmountSumBy(R.prop('transfer_account_uuid'));
    return R.mergeWith(
      (a, b) => a - b,
      sumByAccountId(transactions),
      R.map(v => -v, sumByTransferAccountId(withTransferAccount(transactions)))
    );
  }
);
