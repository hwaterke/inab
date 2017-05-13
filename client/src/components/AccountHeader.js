import React from 'react';
import PropTypes from 'prop-types';
import Amount from './Amount';
import './AccountHeader.scss';

const AccountHeader = ({name, balance}) => (
  <div className="account-header-container">
    <div className="account-header">
      <h1>{name}</h1>
      <div>
        <Amount amount={balance} color />
      </div>
    </div>
  </div>
);

AccountHeader.propTypes = {
  name: PropTypes.string,
  balance: PropTypes.number
};

export default AccountHeader;
