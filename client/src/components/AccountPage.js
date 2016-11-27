import React from 'react';
import TransactionContainer from './TransactionContainer';
import { connect } from 'react-redux';
import {getSortedTransactions} from '../selectors/transactions';
import {getSelectedAccount} from '../selectors/ui';

const AccountPage = ({title, transactions}) => (
  <div className="col-md-12">
    <h1>{title}</h1>
    <TransactionContainer transactions={transactions} />
  </div>
);

AccountPage.propTypes = {
  title: React.PropTypes.string.isRequired,
  transactions: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  let title = "All";
  let transactions = getSortedTransactions(state);

  const aid = getSelectedAccount(state);

  if (aid) {
    title = state.accounts.find((a) => a.id == aid).name;
    transactions = transactions.filter((t) => t.account_id == aid || t.transfer_account_id == aid);
  }

  return {title, transactions};
};

export default connect(mapStateToProps)(AccountPage);
