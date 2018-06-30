import PropTypes from 'prop-types'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import {Amount} from '../../Amount'
import {ButtonIcon} from '../../presentational/atoms/ButtonIcon'

export const ImportTransactionTable = ({transactions, createTransaction}) => (
  <table className="table is-narrow">
    <thead>
      <tr>
        <th>Import</th>
        <th>Date</th>
        <th>Amount</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {transactions.map((tr, index) => (
        <tr key={index}>
          <td>{tr.imported && <FontAwesome name="upload" />}</td>
          <td>{tr.date}</td>
          <td>
            <Amount amount={tr.amount} hasBackground />
          </td>
          <td>
            <ButtonIcon icon="plus" onClick={() => createTransaction(tr)} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

ImportTransactionTable.propTypes = {
  transactions: PropTypes.array.isRequired,
  createTransaction: PropTypes.func.isRequired,
}
