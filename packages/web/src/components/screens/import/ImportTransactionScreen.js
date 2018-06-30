import {ResourceCreator, TransactionResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {selectCleanedImportedTransactions} from '../../../selectors/importSelectors'
import {crudThunks} from '../../../thunks/crudThunks'
import {Box} from '../../presentational/atoms/Box'
import {ImportTransactionTable} from './ImportTransactionTable'

const Intro = styled.p`
  margin-bottom: 1rem;
`

const mapStateToProps = state => ({
  transactions: selectCleanedImportedTransactions(state),
})

@connect(mapStateToProps)
export class ImportTransactionScreen extends React.Component {
  static propTypes = {
    account: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    clearImportAccountUuid: PropTypes.func.isRequired,
    clearImportTransactions: PropTypes.func.isRequired,
    transactions: PropTypes.array.isRequired,
  }

  render() {
    const {
      account,
      clearImportAccountUuid,
      clearImportTransactions,
      transactions,
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

        <ResourceCreator crudThunks={crudThunks} resource={TransactionResource}>
          {({createEntity}) => (
            <ImportTransactionTable
              transactions={transactions}
              createTransaction={createEntity}
            />
          )}
        </ResourceCreator>
      </Box>
    )
  }
}
