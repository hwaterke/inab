import * as Immutable from 'immutable'
import {TransactionResource} from 'inab-shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {select} from 'redux-crud-provider'
import ui from 'redux-ui'
import {Filter} from '../entities/Filter'
import {getTransactionsForRendering} from '../selectors/transactionsRendering'
import {sumOfAmounts} from '../selectors/utils'
import {TransactionSearchService} from '../services/TransactionSearchService'
import {crudThunks} from '../thunks/crudThunks'
import {TransactionFormContainer} from './forms/TransactionFormContainer'
import TransactionFilters from './TransactionFilters'
import TransactionTable from './TransactionTable'
import TransactionToolbar from './TransactionToolbar'
import {TransactionTotalAmount} from './TransactionTotalAmount'

const mapStateToProps = state => ({
  transactionsById: select(TransactionResource).byId(state),
  transactionsForRendering: getTransactionsForRendering(state),
  transactionFilters: state.transactionFilters,
})

const mapDispatchToProps = {
  updateResource: crudThunks.updateResource,
  deleteResource: crudThunks.deleteResource,
}

@ui({
  state: {
    selected: Immutable.Set(),
    editingTransactionId: null,
    addingTransaction: false,
    hideColumn: props => ({
      time: true,
      tags: true,
      account: !!props.hideAccount,
    }),
    searchValue: '',
  },
})
@connect(mapStateToProps, mapDispatchToProps)
class TransactionContainer extends React.Component {
  static propTypes = {
    transactionsById: PropTypes.objectOf(TransactionResource.propTypes)
      .isRequired,
    transactionsForRendering: PropTypes.array.isRequired,
    transactionFilters: PropTypes.arrayOf(PropTypes.instanceOf(Filter)),
    updateResource: PropTypes.func.isRequired,
    deleteResource: PropTypes.func.isRequired,
    accountId: PropTypes.string,
    ui: PropTypes.object.isRequired,
    updateUI: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.searchService = new TransactionSearchService()
  }

  selectTransaction = id => {
    const current = this.props.ui.selected
    if (current.includes(id)) {
      this.props.updateUI('selected', current.delete(id))
    } else {
      this.props.updateUI('selected', current.add(id))
    }
  }

  toggleClearingTransactionStatus = id => {
    const transaction = this.props.transactionsById[id]
    if (transaction.cleared_at) {
      this.props.updateResource({
        resource: TransactionResource,
        entity: {
          ...transaction,
          cleared_at: null,
        },
      })
    } else {
      this.props.updateResource({
        resource: TransactionResource,
        entity: {
          ...transaction,
          cleared_at: new Date(),
        },
      })
    }
  }

  clearSelection = () => {
    this.props.updateUI('selected', Immutable.Set())
  }

  deleteSelection = () => {
    const records = this.props.ui.selected.map(
      id => this.props.transactionsById[id]
    )
    this.clearSelection()
    records.forEach(r =>
      this.props.deleteResource({resource: TransactionResource, entity: r})
    )
  }

  displayNew = () => {
    this.props.updateUI({addingTransaction: true, editingTransactionId: null})
  }

  displayUpdate = transaction_uuid => {
    this.props.updateUI({
      addingTransaction: false,
      editingTransactionId: transaction_uuid,
    })
  }

  hideForm = () => {
    this.props.updateUI({addingTransaction: false, editingTransactionId: null})
  }

  toggleColumn = name => {
    this.props.updateUI('hideColumn', {
      ...this.props.ui.hideColumn,
      [name]: !this.props.ui.hideColumn[name],
    })
  }

  onSearchChange = event => {
    this.props.updateUI('searchValue', event.target.value)
  }

  getTransactionsToRender() {
    // Filter the selected account
    let transactions = this.props.transactionsForRendering
    if (this.props.accountId) {
      transactions = this.props.transactionsForRendering.filter(
        tr => tr.account_uuid === this.props.accountId
      )
    }

    // Filter with Filter[]
    transactions = this.searchService.applyFiltersToTransactions(
      transactions,
      this.props.transactionFilters
    )

    // Filters further with search text
    return this.searchService.filter(transactions, this.props.ui.searchValue)
  }

  render() {
    const transactionsToRender = this.getTransactionsToRender()
    const total = sumOfAmounts(
      transactionsToRender.filter(tr => tr.type !== 'split')
    )

    return (
      <div>
        {(this.props.ui.addingTransaction ||
          this.props.ui.editingTransactionId) && (
          <TransactionFormContainer
            uuid={this.props.ui.editingTransactionId}
            selectedAccountId={this.props.accountId}
            postSubmit={this.hideForm}
            onCancel={this.hideForm}
          />
        )}

        <div className="box-container">
          <TransactionToolbar
            selectedRows={this.props.ui.selected}
            clearSelection={this.clearSelection}
            deleteSelection={this.deleteSelection}
            onNewClick={this.displayNew}
            hiddenColumns={this.props.ui.hideColumn}
            toggleColumn={this.toggleColumn}
            searchValue={this.props.ui.searchValue}
            onSearchChange={this.onSearchChange}
          />

          <TransactionFilters />

          <TransactionTable
            transactions={transactionsToRender}
            selectedRows={this.props.ui.selected}
            onSelectRow={this.selectTransaction}
            onPencilClick={this.displayUpdate}
            onClearClick={this.toggleClearingTransactionStatus}
            hiddenColumns={this.props.ui.hideColumn}
          />

          <TransactionTotalAmount amount={total} />
        </div>
      </div>
    )
  }
}

export default TransactionContainer
