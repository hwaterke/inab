import {TransactionResource} from '@inab/shared'
import {ascend, comparator, descend, prop, sortWith} from 'ramda'
import {select} from 'redux-crud-provider'
import {createSelector} from 'reselect'
import {createTransactionSelectorForRendering} from './transactionsRendering'

const selectImportedTransactions = state => state.imported.transactions
const selectImportedAccountUuid = state => state.imported.account_uuid

export const selectCleanedImportedTransactions = createSelector(
  selectImportedAccountUuid,
  selectImportedTransactions,
  (account_uuid, transactions) =>
    transactions.map(tr => ({
      account_uuid,
      subtransactions: [],
      tags: [],
      type: 'regular',
      ...tr,
    }))
)

const booleanComparator = comparator((a, b) => !a.importId && b.importId)

const dateAmountImportSort = sortWith([
  descend(prop('date')),
  ascend(prop('amount')),
  booleanComparator,
])

export const selectImportedAndExistingTransactions = createSelector(
  select(TransactionResource).asArray,
  selectCleanedImportedTransactions,
  (existingTransactions, importedTransactions) =>
    dateAmountImportSort([...existingTransactions, ...importedTransactions])
)

const getTransactionsForImportRendering = createTransactionSelectorForRendering(
  selectImportedAndExistingTransactions
)

export const selectExistingTransactionsForImportAccount = createSelector(
  selectImportedAccountUuid,
  getTransactionsForImportRendering,
  (account_uuid, transactions) =>
    transactions.filter(tr => tr.account_uuid === account_uuid)
)

const pairTransactionWithImport = (
  transactions: [],
  importedTransactions: []
) => {
  const result = {}

  transactions.forEach(transaction => {
    const candidates = importedTransactions
      .filter(
        itr =>
          itr.date === transaction.date &&
          ((itr.amount === transaction.amount &&
            !transaction.transfer_account_uuid) ||
            (itr.amount === -transaction.amount &&
              transaction.transfer_account_uuid))
      )
      .map(prop('importId'))

    result[transaction.uuid] = candidates

    candidates.forEach(c => {
      result[c] = result[c] || []
      result[c].push(transaction.uuid)
    })
  })

  return result
}

export const selectTransactionPairs = createSelector(
  select(TransactionResource).asArray,
  selectCleanedImportedTransactions,
  pairTransactionWithImport
)
