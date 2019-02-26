// @flow
import {createSelector} from 'reselect'
import type {Account, Category, Payee, Transaction} from '@inab/shared'
import {
  AccountResource,
  CategoryResource,
  getSortedTransactions,
  PayeeResource,
} from '@inab/shared'
import {select} from 'redux-crud-provider'

const getMirrorTransfer = transaction => {
  const mirror = {...transaction}
  mirror.key = mirror.uuid + 'r'
  mirror.account_uuid = transaction.transfer_account_uuid
  mirror.transfer_account_uuid = transaction.account_uuid
  mirror.accountName = transaction.transferAccountName
  mirror.transferAccountName = transaction.accountName
  mirror.amount = -mirror.amount
  return mirror
}

export const getTransactionForRendering = createSelector(
  getSortedTransactions,
  select(AccountResource).byId,
  select(CategoryResource).byId,
  select(PayeeResource).byId,
  (
    transactions: Transaction[],
    accountsById: {[string]: Account},
    categoriesById: {[string]: Category},
    payeeById: {string: Payee}
  ) => {
    const result = []

    transactions.forEach(tr => {
      const trResult = {...tr, key: tr.uuid}

      if (tr.type === 'to_be_budgeted') {
        trResult.categoryName = 'To be budgeted'
      }
      if (tr.type === 'split') {
        trResult.categoryName = 'Split'
      }
      if (tr.type === 'regular' && tr.category_uuid) {
        trResult.categoryName = categoriesById[tr.category_uuid].name
      }

      trResult.accountName = accountsById[tr.account_uuid].name

      if (tr.payee_uuid) {
        trResult.payeeName = payeeById[tr.payee_uuid].name
      }

      if (tr.transfer_account_uuid) {
        trResult.isTransfer = true
        trResult.transferAccountName =
          accountsById[tr.transfer_account_uuid].name
      }

      result.push(trResult)
      if (tr.transfer_account_uuid) {
        result.push(getMirrorTransfer(trResult))
      }
    })

    return result
  }
)
