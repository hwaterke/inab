import React from 'react';
import Amount from './Amount';
import './AccountHeader.scss';

const AccountHeader = ({name, balance}) => (
  <div className="account-header-container">
    <div className="account-header">
      <h1>{name}</h1>
      <div>
        <Amount amount={balance} color/>
      </div>
    </div>
  </div>
);

AccountHeader.propTypes = {
  name: React.PropTypes.string,
  balance: React.PropTypes.number
};

export default AccountHeader;
