import React from 'react';
import './TransactionTotalAmount.scss';
import Amount from './Amount';

const TransactionTotalAmount = ({amount}) => {
  return (
    <div className="transaction-total">
      <span className="transaction-total-label">Total</span>
      <Amount amount={amount} color/>
    </div>
  );
};

TransactionTotalAmount.propTypes = {
  amount: React.PropTypes.number
};

export default TransactionTotalAmount;
