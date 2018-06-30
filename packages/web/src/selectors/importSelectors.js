import {createSelector} from 'reselect'

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
      imported: true,
    }))
)
