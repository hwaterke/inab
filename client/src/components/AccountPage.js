import React from 'react';
import {connect} from 'react-redux';
import {getSelectedAccount} from '../selectors/ui';
import {getBalanceByAccountId} from '../selectors/accounts';
import {getBudgetBalance} from '../selectors/budget';
import AccountHeader from './AccountHeader';
import TransactionContainer from './TransactionContainer';

const AccountPage = ({title, balance, selectedAccountId}) => (
  <div>
    <AccountHeader name={title} balance={balance} />
    <TransactionContainer
      accountId={selectedAccountId}
      hideAccount={!!selectedAccountId}
    />
  </div>
);

AccountPage.propTypes = {
  title: React.PropTypes.string.isRequired,
  balance: React.PropTypes.number,
  selectedAccountId: React.PropTypes.string
};

const mapStateToProps = (state) => {
  let title = 'All';
  let balance = getBudgetBalance(state);

  const aid = getSelectedAccount(state);

  if (aid) {
    // Check if the account exist.
    const account = state.accounts.find((a) => a.uuid == aid);
    if (account) {
      title = account.name;
      balance = getBalanceByAccountId(state).get(aid);
    }
  }

  return {
    title,
    balance,
    selectedAccountId: aid
  };
};

export default connect(mapStateToProps)(AccountPage);
