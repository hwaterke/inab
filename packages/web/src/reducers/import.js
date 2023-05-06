/* eslint-disable default-case */
const SET_IMPORT_ACCOUNT_UUID = 'SET_IMPORT_ACCOUNT_UUID'
const SET_IMPORT_TRANSACTIONS = 'SET_IMPORT_TRANSACTIONS'

export const setImportAccountUuid = (account_uuid) => ({
  type: SET_IMPORT_ACCOUNT_UUID,
  account_uuid,
})

export const clearImportAccountUuid = () => setImportAccountUuid(null)

export const setImportTransactions = (transactions) => ({
  type: SET_IMPORT_TRANSACTIONS,
  transactions,
})

export const clearImportTransactions = () => setImportTransactions(null)

const initialState = {
  account_uuid: null,
  transactions: null,
}

export const importReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IMPORT_ACCOUNT_UUID:
      return {...state, account_uuid: action.account_uuid}
    case SET_IMPORT_TRANSACTIONS:
      return {...state, transactions: action.transactions}
  }
  return state
}
