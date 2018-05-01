import React from 'react'
import PropTypes from 'prop-types'
import './TransactionTotalAmount.scss'
import {Amount} from './Amount'

const TransactionTotalAmount = ({amount}) => {
  return (
    <div className="transaction-total">
      <span className="transaction-total-label">Total</span>
      <Amount amount={amount} hasBackground />
    </div>
  )
}

TransactionTotalAmount.propTypes = {
  amount: PropTypes.number,
}

export default TransactionTotalAmount
