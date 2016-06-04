'use strict';
import React from 'react';
import FetchTransactionsButton from './FetchTransactionsButton';
import TransactionTable from './TransactionTable';
import { connect } from 'react-redux';

const AccountPage = (props) => (
  <div>
    <h1>{props.account.name}</h1>
    <FetchTransactionsButton />
    <TransactionTable />
  </div>
);

AccountPage.propTypes = {
  account: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const aid = state.selectedPage.data;
  return {account: state.accounts.find((a) => a.id == aid)};
}

export default connect(mapStateToProps)(AccountPage);
