'use strict';
import React from 'react';
import FetchTransactionsButton from './FetchTransactionsButton';
import TransactionTable from './TransactionTable';

const AccountPage = () => (
  <div>
    <FetchTransactionsButton />
    <TransactionTable />
  </div>
);

export default AccountPage;
