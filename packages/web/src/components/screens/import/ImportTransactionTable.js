import PropTypes from 'prop-types'
import {
  equals,
  identity,
  map,
  path,
  pick,
  pickBy,
  pipe,
  isEmpty,
  prop,
  sortBy,
} from 'ramda'
import React, {Fragment} from 'react'
import FontAwesome from 'react-fontawesome'
import styled from 'styled-components'
import {colors} from '../../../constants/colors'
import {Amount} from '../../Amount'
import {Tags} from '../../TransactionTable'

const statusIcons = {
  exist0: 'times',
  exist1: 'edit',
  exists: 'check',
  existn: 'question',
  import0: 'plus',
  import1: 'check',
  importn: 'question',
}

const statusColor = {
  exist0: colors.red,
  exist1: colors.yellow,
  exists: 'white',
  existn: 'grey',
  import0: colors.green,
  import1: 'white',
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

// List of properties that are considered to decide if we need to update an existing transaction
const updatableFields = [
  'date',
  'time',
  'description',
  'payee_uuid',
  'category_uuid',
  'amount',
  'category_uuid',
  'account_uuid',
  'transfer_account_uuid',
  'type',
  'tags',
]

// Picks only the properties of the transaction worth looking at for updating
export const getUpdatableFields = transaction => {
  const fields = pick(updatableFields, transaction)

  const tagNames = pipe(
    map(prop('name')),
    sortBy(identity),
    map(name => ({name}))
  )

  return {
    ...fields,
    tags: tagNames(fields.tags),
  }
}

// Returns only the properties of the imported transaction that should be updated on the existing one.
export function fieldDifferenceForUpdate(transaction, importedTransaction) {
  const existing = getUpdatableFields(transaction)
  const imported = getUpdatableFields(importedTransaction)

  return pickBy(
    (val, key) => imported[key] && !equals(existing[key], imported[key]),
    imported
  )
}

function needsUpdate(transaction, importedTransaction) {
  return !isEmpty(fieldDifferenceForUpdate(transaction, importedTransaction))
}

const getStatus = (transaction, pairs, importedTransactionsById) => {
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

  if (numberOfPairs === 1) {
    if (
      needsUpdate(
        transaction,
        importedTransactionsById[pairs[transaction.uuid][0]]
      )
    ) {
      return 'exist1'
    }
    return 'exists'
  }

  return `exist${numberOfPairs}`
}

export const ImportTransactionTable = ({
  transactions,
  importedTransactionsById,
  createTransaction,
  updateTransaction,
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
          <ImportStatus status={getStatus(tr, pairs, importedTransactionsById)}>
            <FontAwesome
              name={statusIcons[getStatus(tr, pairs, importedTransactionsById)]}
            />
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

            {tr.uuid &&
              getStatus(tr, pairs, importedTransactionsById) === 'exist1' && (
                <a
                  onClick={() =>
                    updateTransaction(
                      tr.uuid,
                      importedTransactionsById[pairs[tr.uuid][0]]
                    )
                  }
                  role="button"
                >
                  Update
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
  importedTransactionsById: PropTypes.object.isRequired,
  createTransaction: PropTypes.func.isRequired,
  updateTransaction: PropTypes.func.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  pairs: PropTypes.object.isRequired,
}
