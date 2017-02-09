import React from 'react';
import TransactionTable from './TransactionTable';
import {connect} from 'react-redux';
import {getTransactionsForRendering} from '../selectors/transactionsRendering';
import * as Immutable from 'immutable';
import TransactionToolbar from './TransactionToolbar';
import ui from 'redux-ui';
import TransactionForm from './forms/TransactionForm';
import {getTransactions, getTransactionsById} from '../selectors/transactions';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import TransactionTotalAmount from './TransactionTotalAmount';
import sumBy from 'lodash/sumBy';
import TransactionFilters from './TransactionFilters';
import {TransactionSearchService} from '../services/TransactionSearchService';
import {Filter} from '../entities/Filter';
import {TransactionResource} from '../entities/Transaction';

const mapStateToProps = (state) => ({
  transactions: getTransactions(state),
  transactionsById: getTransactionsById(state),
  transactionsForRendering: getTransactionsForRendering(state),
  transactionFilters: state.transactionFilters
});

@ui({
  state: {
    selected: Immutable.Set(),
    editingTransactionId: null,
    addingTransaction: false,
    hideColumn: (props) => ({
      time: true,
      tags: true,
      account: !!props.hideAccount
    }),
    searchValue: ''
  }
})
@connect(mapStateToProps, asyncActionCreatorsFor(TransactionResource.path))
class TransactionContainer extends React.Component {

  static propTypes = {
    transactions: React.PropTypes.arrayOf(TransactionResource.propType).isRequired,
    transactionsById: React.PropTypes.instanceOf(Map).isRequired,
    transactionsForRendering: React.PropTypes.array.isRequired,
    transactionFilters: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Filter)),
    update: React.PropTypes.func.isRequired,
    delete: React.PropTypes.func.isRequired,
    accountId: React.PropTypes.number,
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.searchService = new TransactionSearchService();
    this.selectTransaction = this.selectTransaction.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.deleteSelection = this.deleteSelection.bind(this);
    this.displayNew = this.displayNew.bind(this);
    this.displayUpdate = this.displayUpdate.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.toggleColumn = this.toggleColumn.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.toggleClearingTransactionStatus = this.toggleClearingTransactionStatus.bind(this);
  }

  selectTransaction(id) {
    const current = this.props.ui.selected;
    if (current.includes(id)) {
      this.props.updateUI('selected', current.delete(id));
    } else {
      this.props.updateUI('selected', current.add(id));
    }
  }

  toggleClearingTransactionStatus(id) {
    const transaction = this.props.transactionsById.get(id);
    if (transaction.cleared_at) {
      this.props.update({...transaction, cleared_at: null});
    } else {
      this.props.update({...transaction, cleared_at: new Date()});
    }
  }

  clearSelection() {
    this.props.updateUI('selected', Immutable.Set());
  }

  deleteSelection() {
    const records = this.props.ui.selected.map(id => this.props.transactionsById.get(id));
    this.clearSelection();
    records.forEach(r => this.props.delete(r));
  }

  displayNew() {
    this.props.updateUI({addingTransaction: true, editingTransactionId: null});
  }

  displayUpdate(transaction_id) {
    this.props.updateUI({addingTransaction: false, editingTransactionId: transaction_id});
  }

  hideForm() {
    this.props.updateUI({addingTransaction: false, editingTransactionId: null});
  }

  toggleColumn(name) {
    this.props.updateUI('hideColumn', {
      ...this.props.ui.hideColumn,
      [name]: !this.props.ui.hideColumn[name]
    });
  }

  onSearchChange(event) {
    this.props.updateUI('searchValue', event.target.value);
  }

  getTransactionsToRender() {
    // Filter the selected account
    let transactions = this.props.transactionsForRendering;
    if (this.props.accountId) {
      transactions = this.props.transactionsForRendering.filter(tr => tr.account_id === this.props.accountId);
    }

    // Filter with Filter[]
    transactions = this.searchService.applyFiltersToTransactions(transactions, this.props.transactionFilters);

    // Filters further with search text
    return this.searchService.filter(transactions, this.props.ui.searchValue);
  }

  render() {
    const transactionsToRender = this.getTransactionsToRender();
    const total = sumBy(transactionsToRender.filter(tr => tr.type != 'split'), 'amount');

    return (
      <div>
        {(this.props.ui.addingTransaction || this.props.ui.editingTransactionId) &&
        <TransactionForm
          updatedResource={this.props.transactions.find(tr => tr.id === this.props.ui.editingTransactionId)}
          selectedAccountId={this.props.accountId}
          postSubmit={this.hideForm}
          onCancel={this.hideForm}
        />
        }

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
    );
  }
}

export default TransactionContainer;
