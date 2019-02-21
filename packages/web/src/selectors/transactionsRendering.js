import {
  AccountResource,
  CategoryResource,
  getSortedTransactions,
  PayeeResource,
} from '@inab/shared'
import {map, prop} from 'ramda'
import {select} from 'redux-crud-provider'
import {createSelector} from 'reselect'

const getMirrorTransfer = transaction => {
  const mirror = Object.assign({}, transaction)
  mirror.key = mirror.uuid + 'r'
  mirror.account_uuid = transaction.transfer_account_uuid
  mirror.transfer_account_uuid = transaction.account_uuid
  mirror.account = transaction.payee
  mirror.payee = transaction.account
  mirror.amount = -mirror.amount
  return mirror
}

// Converts the transactions to TransactionView
export const createTransactionSelectorForRendering = transactionSelector =>
  createSelector(
    transactionSelector,
    select(AccountResource).byId,
    select(CategoryResource).byId,
    select(PayeeResource).byId,
    (transactions, accountsById, categoriesById, payeeById) => {
      const result = []

      transactions.forEach(tr => {
        const tr_result = {
          ...tr,
          key: tr.uuid,
          account: accountsById[tr.account_uuid].name,
          is_transfer: !!tr.transfer_account_uuid,
          tagsForSearch: tr.tags.map(t => t.name).join(','),
        }
        tr_result.display_date = tr.date

        if (tr.payee_uuid) {
          tr_result.payee = payeeById[tr.payee_uuid].name
        } else if (tr.transfer_account_uuid) {
          tr_result.payee = accountsById[tr.transfer_account_uuid].name
        }

        if (tr.type === 'to_be_budgeted') {
          tr_result.category = 'To be budgeted'
        }
        if (tr.type === 'split') {
          tr_result.category = 'Split'
        }
        if (tr.type === 'regular' && tr.category_uuid) {
          tr_result.category = categoriesById[tr.category_uuid].name
        }

        result.push(tr_result)
        if (tr.transfer_account_uuid) {
          result.push(getMirrorTransfer(tr_result))
        }

        tr.subtransactions.forEach((str, strIndex) => {
          const str_result = {
            key: 's' + (str.uuid ? str.uuid : 'i' + strIndex),
            uuid: str.uuid,
            date: tr.date,
            account_uuid: tr.account_uuid,
            category_uuid: str.category_uuid,
            category: str.category_uuid
              ? categoriesById[str.category_uuid].name
              : '',
            description: str.description,
            amount: str.amount,
            subtransaction: true,
            tags: [],
            parent_transaction: tr.uuid,
          }
          result.push(str_result)
        })
      })

      return result
    }
  )

export const getTransactionsForRendering = createTransactionSelectorForRendering(
  getSortedTransactions
)

export const getTransactionColumns = createSelector(
  select(AccountResource).byId,
  select(CategoryResource).byId,
  select(PayeeResource).byId,
  (accountsById, categoriesById, payeesById) => ({
    account: {
      label: 'Account',
      type: 'text',
      options: map(prop('name'), accountsById),
    },
    date: {
      label: 'Date',
      type: 'date',
    },
    category_uuid: {
      label: 'Category',
      type: 'text',
      options: map(prop('name'), categoriesById),
    },
    amount: {
      label: 'Amount',
      type: 'number',
    },
    description: {
      label: 'Description',
      type: 'text',
    },
    payee: {
      label: 'Payee',
      type: 'text',
      options: map(prop('name'), payeesById),
    },
  })
)
