// @flow
import PropTypes from 'prop-types'
// eslint-disable-next-line import/named
import type {ResourceDefinition} from 'redux-crud-provider'

const tagPropType: ReactPropsCheckType = PropTypes.shape({
  name: PropTypes.string.isRequired,
})

const subtransactionPropType: ReactPropsCheckType = PropTypes.shape({
  uuid: PropTypes.string,
  description: PropTypes.string,
  amount: PropTypes.number.isRequired,
  category_uuid: PropTypes.string,
})

export const TransactionResource: ResourceDefinition = {
  name: 'transactions',
  key: 'uuid',
  defaultPath: 'transactions',
  propTypes: PropTypes.shape({
    uuid: PropTypes.string,
    date: PropTypes.string.isRequired,
    time: PropTypes.string,
    payee_uuid: PropTypes.string,
    description: PropTypes.string,
    amount: PropTypes.number.isRequired,
    category_uuid: PropTypes.string,
    account_uuid: PropTypes.string.isRequired,
    transfer_account_uuid: PropTypes.string,
    type: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(tagPropType).isRequired,
    subtransactions: PropTypes.arrayOf(subtransactionPropType).isRequired,
  }),
}

export type TransactionTag = {
  name: string,
}

export type Subtransaction = {
  uuid: string,
  description?: string,
  amount: number,
  category_uuid: string,
}

export type Transaction = {
  uuid: string,
  date: string,
  time?: string,
  payee_uuid?: string,
  description?: string,
  amount: number,
  category_uuid?: string,
  account_uuid: string,
  transfer_account_uuid?: string,
  type: string,
  tags: TransactionTag[],
  subtransactions: Subtransaction[],
}
