import {PayeeResource, TransactionResource} from '@inab/shared'
import {ascend, comparator, descend, indexBy, path, prop, sortWith} from 'ramda'
import {select} from 'redux-crud-provider'
import {createSelector} from 'reselect'
import {createTransactionSelectorForRendering} from './transactionsRendering'

const selectRawImportedTransactions = (state) => state.imported.transactions
const selectRawImportedAccountUuid = (state) => state.imported.account_uuid

export const selectCleanedImportedTransactions = createSelector(
  selectRawImportedAccountUuid,
  selectRawImportedTransactions,
  select(PayeeResource).asArray,
  (account_uuid, transactions, payees) =>
    transactions.map((tr) => ({
      account_uuid,
      payee_uuid:
        path(
          ['uuid'],
          payees.find(
            (payee) =>
              payee.name.toUpperCase() === (tr.payee && tr.payee.toUpperCase())
          )
        ) || null,
      subtransactions: [],
      type: 'regular',
      ...tr,
      tags: tr.tags ? tr.tags.split(',').map((tag) => ({name: tag})) : [],
      time: tr.time || undefined,
      payee: undefined,
    }))
)

export const selectImportedTransactionsById = createSelector(
  selectCleanedImportedTransactions,
  indexBy(prop('importId'))
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
  selectRawImportedAccountUuid,
  getTransactionsForImportRendering,
  (account_uuid, transactions) =>
    transactions.filter((tr) => tr.account_uuid === account_uuid)
)

const pairTransactionWithImport = (transactions, importedTransactions) => {
  const result = {}

  transactions.forEach((transaction) => {
    const candidates = importedTransactions
      .filter(
        (itr) =>
          itr.date === transaction.date &&
          ((itr.amount === transaction.amount &&
            !transaction.transfer_account_uuid) ||
            (itr.amount === -transaction.amount &&
              transaction.transfer_account_uuid))
      )
      .map(prop('importId'))

    result[transaction.uuid] = candidates

    candidates.forEach((c) => {
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
