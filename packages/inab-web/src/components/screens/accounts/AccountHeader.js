import React from 'react'
import PropTypes from 'prop-types'
import {Amount} from '../../Amount'
import './AccountHeader.scss'

export const AccountHeader = ({name, balance}) => (
  <div className="full-header-container">
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="account-header">
            <h1>{name}</h1>
            <div>
              <Amount amount={balance} hasBackground />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

AccountHeader.propTypes = {
  name: PropTypes.string,
  balance: PropTypes.number,
}
