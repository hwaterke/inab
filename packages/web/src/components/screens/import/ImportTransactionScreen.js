import {TransactionResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {
  selectExistingTransactionsForImportAccount,
  selectImportedTransactionsById,
  selectTransactionPairs,
} from '../../../selectors/importSelectors'
import {crudThunks} from '../../../thunks/crudThunks'
import {Box} from '../../presentational/atoms/Box'
import {ImportTransactionTable} from './ImportTransactionTable'
import {TransactionUpdateModal} from './TransactionUpdateModal'

const Intro = styled.p`
  margin-bottom: 1rem;
`

const mapStateToProps = state => ({
  transactions: selectExistingTransactionsForImportAccount(state),
  importedTransactionsById: selectImportedTransactionsById(state),
  pairs: selectTransactionPairs(state),
})

const mapDispatchToProps = {
  createResource: crudThunks.createResource,
  updateResource: crudThunks.updateResource,
  deleteResource: crudThunks.deleteResource,
}

export const ImportTransactionScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class ImportTransactionScreen extends React.Component {
    static propTypes = {
      account: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      clearImportAccountUuid: PropTypes.func.isRequired,
      clearImportTransactions: PropTypes.func.isRequired,
      transactions: PropTypes.array.isRequired,
      importedTransactionsById: PropTypes.object.isRequired,
      pairs: PropTypes.object.isRequired,

      createResource: PropTypes.func.isRequired,
      deleteResource: PropTypes.func.isRequired,
    }

    state = {
      transactionUuidForUpdate: null,
      transactionDataForUpdate: null,
    }

    updateTransaction = (uuid, newData) => {
      this.setState({
        transactionUuidForUpdate: uuid,
        transactionDataForUpdate: newData,
      })
    }

    createTransaction = transaction =>
      this.props.createResource({
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
        importedTransactionsById,
        pairs,
      } = this.props

      const {transactionUuidForUpdate, transactionDataForUpdate} = this.state

      return (
        <Box>
          <Intro>
            Importing <b>transactions</b>
            <a
              role="button"
              className="delete"
              onClick={clearImportTransactions}
            >
              Clear transactions
            </a>{' '}
            for account: <b>{account.name}</b>
            <a
              role="button"
              className="delete"
              onClick={clearImportAccountUuid}
            >
              Clear account
            </a>
          </Intro>

          <ImportTransactionTable
            transactions={transactions}
            importedTransactionsById={importedTransactionsById}
            createTransaction={this.createTransaction}
            updateTransaction={this.updateTransaction}
            deleteTransaction={this.deleteTransaction}
            pairs={pairs}
          />

          {transactionUuidForUpdate && (
            <TransactionUpdateModal
              uuid={transactionUuidForUpdate}
              newData={transactionDataForUpdate}
              onCloseRequested={() => this.updateTransaction(null, null)}
            />
          )}
        </Box>
      )
    }
  }
)
