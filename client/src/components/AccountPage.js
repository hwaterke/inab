import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getSelectedAccount} from '../selectors/ui';
import AccountHeader from './AccountHeader';
import TransactionContainer from './TransactionContainer';
import {byIdSelector} from 'hw-react-shared';
import {AccountResource, getBudgetBalance, selectBalanceByAccountId} from 'inab-shared';

const AccountPage = ({title, balance, selectedAccountId}) =>
  <div>
    <AccountHeader name={title} balance={balance} />
    <TransactionContainer accountId={selectedAccountId} hideAccount={!!selectedAccountId} />
  </div>;

AccountPage.propTypes = {
  title: PropTypes.string.isRequired,
  balance: PropTypes.number,
  selectedAccountId: PropTypes.string
};

const mapStateToProps = state => {
  let title = 'All';
  let balance = getBudgetBalance(state);

  const aid = getSelectedAccount(state);

  if (aid) {
    // Check if the account exist.
    const account = byIdSelector(AccountResource)(state)[aid];
    if (account) {
      title = account.name;
      balance = selectBalanceByAccountId(state)[aid];
    }
  }

  return {
    title,
    balance,
    selectedAccountId: aid
  };
};

export default connect(mapStateToProps)(AccountPage);
