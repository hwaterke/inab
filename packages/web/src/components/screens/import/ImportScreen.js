import {AccountResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {select} from 'redux-crud-provider'
import {
  clearImportAccountUuid,
  clearImportTransactions,
  setImportAccountUuid,
  setImportTransactions,
} from '../../../reducers/import'
import {Section} from '../../presentational/atoms/Section'
import {ImportAccountSelector} from './ImportAccountSelector'
import {ImportFileDropzone} from './ImportFileDropzone'
import {ImportTransactionScreen} from './ImportTransactionScreen'

const mapStateToProps = (state) => ({
  accountsById: select(AccountResource).byId(state),
  imported: state.imported,
})

const mapDispatchToProps = {
  setImportAccountUuid,
  clearImportAccountUuid,
  setImportTransactions,
  clearImportTransactions,
}

export const ImportScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class ImportScreen extends React.Component {
    static propTypes = {
      imported: PropTypes.shape({
        account_uuid: PropTypes.string,
        transactions: PropTypes.array,
      }).isRequired,
      setImportAccountUuid: PropTypes.func.isRequired,
      clearImportAccountUuid: PropTypes.func.isRequired,
      setImportTransactions: PropTypes.func.isRequired,
      clearImportTransactions: PropTypes.func.isRequired,
      accountsById: PropTypes.object.isRequired,
    }

    render() {
      const {
        setImportAccountUuid,
        clearImportAccountUuid,
        setImportTransactions,
        clearImportTransactions,
        accountsById,
      } = this.props
      const {account_uuid, transactions} = this.props.imported

      return (
        <Section>
          {account_uuid ? null : (
            <ImportAccountSelector onSelect={setImportAccountUuid} />
          )}

          {account_uuid && !transactions && (
            <ImportFileDropzone
              account={accountsById[account_uuid]}
              clearImportAccountUuid={clearImportAccountUuid}
              setImportTransactions={setImportTransactions}
            />
          )}

          {account_uuid && transactions && (
            <ImportTransactionScreen
              account={accountsById[account_uuid]}
              clearImportAccountUuid={clearImportAccountUuid}
              clearImportTransactions={clearImportTransactions}
            />
          )}
        </Section>
      )
    }
  }
)
