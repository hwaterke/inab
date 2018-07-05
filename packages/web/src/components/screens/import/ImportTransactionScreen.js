import {TransactionResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {
  selectExistingTransactionsForImportAccount,
  selectTransactionPairs,
} from '../../../selectors/importSelectors'
import {crudThunks} from '../../../thunks/crudThunks'
import {Box} from '../../presentational/atoms/Box'
import {ImportTransactionTable} from './ImportTransactionTable'

const Intro = styled.p`
  margin-bottom: 1rem;
`

const mapStateToProps = state => ({
  transactions: selectExistingTransactionsForImportAccount(state),
  pairs: selectTransactionPairs(state),
})

const mapDispatchToProps = {
  createResource: crudThunks.createResource,
  updateResource: crudThunks.updateResource,
  deleteResource: crudThunks.deleteResource,
}

@connect(mapStateToProps, mapDispatchToProps)
export class ImportTransactionScreen extends React.Component {
  static propTypes = {
    account: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    clearImportAccountUuid: PropTypes.func.isRequired,
    clearImportTransactions: PropTypes.func.isRequired,
    transactions: PropTypes.array.isRequired,
    pairs: PropTypes.object.isRequired,

    createResource: PropTypes.func.isRequired,
    updateResource: PropTypes.func.isRequired,
    deleteResource: PropTypes.func.isRequired,
  }

  createTransaction = transaction =>
    this.props.createResource({
      resource: TransactionResource,
      entity: transaction,
    })

  updateTransaction = transaction =>
    this.props.updateResource({
      resource: TransactionResource,
      entity: transaction,
    })

  deleteTransaction = transaction =>
    this.props.deleteResource({
      resource: TransactionResource,
      entity: transaction,
    })

  render() {
    const {
      account,
      clearImportAccountUuid,
      clearImportTransactions,
      transactions,
      pairs,
    } = this.props

    return (
      <Box>
        <Intro>
          Importing <b>transactions</b>
          <a role="button" className="delete" onClick={clearImportTransactions}>
            Clear transactions
          </a>{' '}
          for account: <b>{account.name}</b>
          <a role="button" className="delete" onClick={clearImportAccountUuid}>
            Clear account
          </a>
        </Intro>

        <ImportTransactionTable
          transactions={transactions}
          createTransaction={this.createTransaction}
          updateTransaction={this.updateTransaction}
          deleteTransaction={this.deleteTransaction}
          pairs={pairs}
        />
      </Box>
    )
  }
}
