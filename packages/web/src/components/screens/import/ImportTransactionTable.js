import PropTypes from 'prop-types'
import {path} from 'ramda'
import React, {Fragment} from 'react'
import FontAwesome from 'react-fontawesome'
import styled from 'styled-components'
import {colors} from '../../../constants/colors'
import {Amount} from '../../Amount'
import {Tags} from '../../TransactionTable'

const statusIcons = {
  exist0: 'times',
  exist1: 'edit',
  existn: 'question',
  import0: 'plus',
  import1: 'edit',
  importn: 'question',
}

const statusColor = {
  exist0: colors.red,
  exist1: colors.yellow,
  existn: 'grey',
  import0: colors.green,
  import1: colors.yellow,
  importn: 'grey',
}

const TransactionRow = styled.tr`
  background-color: ${props => (props.imported ? '#F5F5F5' : 'white')};
`

const ImportStatus = styled.td`
  width: 3rem;
  text-align: center;
  background-color: ${({status}) => statusColor[status]};
`

const getStatus = (transaction, pairs) => {
  if (transaction.importId) {
    const numberOfPairs = path([transaction.importId, 'length'], pairs) || 0

    if (numberOfPairs > 1) {
      return 'importn'
    }
    return `import${numberOfPairs}`
  }

  const numberOfPairs = path([transaction.uuid, 'length'], pairs) || 0

  if (numberOfPairs > 1) {
    return 'existn'
  }
  return `exist${numberOfPairs}`
}

export const ImportTransactionTable = ({
  transactions,
  createTransaction,
  deleteTransaction,
  pairs,
}) => (
  <table className="table is-fullwidth is-narrow">
    <thead>
      <tr>
        <th />
        <th>Date</th>
        <th>Time</th>
        <th>Payee</th>
        <th>Category</th>
        <th>Description</th>
        <th>Tags</th>
        <th className="has-text-right">Amount</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {transactions.map(tr => (
        <TransactionRow key={tr.uuid || tr.importId} imported={!!tr.importId}>
          <ImportStatus status={getStatus(tr, pairs)}>
            <FontAwesome name={statusIcons[getStatus(tr, pairs)]} />
          </ImportStatus>
          <td>{tr.display_date}</td>
          <td>{tr.time}</td>
          <td>
            <Fragment>
              {tr.is_transfer && <FontAwesome name="exchange" />}
              {tr.payee}
            </Fragment>
          </td>
          <td>{tr.category}</td>
          <td>{tr.description}</td>

          <td>
            <Tags>{tr.tags.map(t => <span key={t.name}>{t.name}</span>)}</Tags>
          </td>

          <td className="has-text-right">
            <Amount amount={tr.amount} hasBackground />
          </td>
          <td>
            {tr.importId && (
              <a onClick={() => createTransaction(tr)} role="button">
                Create
              </a>
            )}

            {tr.uuid && (
              <a onClick={() => deleteTransaction(tr)} role="button">
                Delete
              </a>
            )}
          </td>
        </TransactionRow>
      ))}
    </tbody>
  </table>
)

ImportTransactionTable.propTypes = {
  transactions: PropTypes.array.isRequired,
  createTransaction: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  updateTransaction: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  pairs: PropTypes.object.isRequired,
}
