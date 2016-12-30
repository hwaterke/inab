import React from 'react';
import {connect} from 'react-redux';
import {getSelectedAccount} from '../selectors/ui';
import {getBalanceByAccountId} from '../selectors/accounts';
import {getBudgetBalance} from '../selectors/budget';
import AccountHeader from './AccountHeader';
import TransactionContainer from './TransactionContainer';

const AccountPage = ({title, balance, selectedAccountId}) => (
  <div>
    <AccountHeader name={title} balance={balance}/>
    <div className="col-md-12">
      <TransactionContainer
        accountId={selectedAccountId}
        hideAccount={!!selectedAccountId}
      />
    </div>
  </div>
);

AccountPage.propTypes = {
  title: React.PropTypes.string.isRequired,
  balance: React.PropTypes.number,
  selectedAccountId: React.PropTypes.number
};

const mapStateToProps = (state) => {
  let title = "All";
  let balance = getBudgetBalance(state);

  const aid = getSelectedAccount(state);

  if (aid) {
    // Check if the account exist.
    const account = state.accounts.find((a) => a.id == aid);
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
