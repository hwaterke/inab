import {
  amountFromCents,
  amountToCents,
  ResourceFormProvider,
  TransactionResource,
} from '@inab/shared'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import {crudThunks} from '../../../thunks/crudThunks'
import {TransactionForm} from './TransactionForm'

const formToResource = (data) => {
  const transaction = {...data}

  // Compute the type of transaction
  transaction.type = 'regular'
  if (data.category === 'tbb') {
    transaction.type = 'to_be_budgeted'
    transaction.category = null
  } else if (data.category === 'split') {
    transaction.type = 'split'
    transaction.category = null
  } else {
    transaction.category_uuid = data.category
  }

  // Compute the transfer_account_uuid
  transaction.payee_uuid = data.payee
  transaction.transfer_account_uuid = null
  if (data.payee && data.payee.startsWith('transfer:')) {
    transaction.transfer_account_uuid = data.payee.slice('transfer:'.length)
    transaction.payee_uuid = null
  }

  transaction.amount = amountToCents(data.amount)

  // Update the subtransactions
  if (data.category === 'split' && data.subtransactions) {
    transaction.subtransactions = data.subtransactions.map((str) => ({
      amount: amountToCents(str.amount),
      category_uuid: str.category,
      description: str.description,
    }))
  } else {
    transaction.subtransactions = []
  }
  transaction.tags = []

  return transaction
}

export class TransactionFormContainer extends React.Component {
  static propTypes = {
    uuid: PropTypes.string,
    selectedAccountId: PropTypes.string,
    postSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  resourceToForm = (transaction) => {
    const formData = {
      account_uuid: this.props.selectedAccountId,
      date: moment().format('YYYY-MM-DD'),
    }

    if (transaction) {
      formData.account_uuid = transaction.account_uuid
      formData.date = transaction.date
      formData.description = transaction.description
      formData.amount = amountFromCents(transaction.amount)

      if (transaction.transfer_account_uuid) {
        formData.payee = 'transfer:' + transaction.transfer_account_uuid
      } else {
        formData.payee = transaction.payee_uuid
      }

      if (transaction.type === 'to_be_budgeted') {
        formData.category = 'tbb'
      } else if (transaction.type === 'split') {
        formData.category = 'split'
      } else {
        formData.category = transaction.category_uuid
      }

      formData.subtransactions = transaction.subtransactions.map((str) => ({
        amount: amountFromCents(str.amount),
        description: str.description,
        category: str.category_uuid,
      }))
    }

    return formData
  }

  render() {
    const {uuid, postSubmit, onCancel} = this.props
    return (
      <ResourceFormProvider
        crudThunks={crudThunks}
        uuid={uuid}
        resource={TransactionResource}
        formToResource={formToResource}
        resourceToForm={this.resourceToForm}
        postAction={postSubmit}
      >
        {(props) => <TransactionForm {...props} onCancel={onCancel} />}
      </ResourceFormProvider>
    )
  }
}
