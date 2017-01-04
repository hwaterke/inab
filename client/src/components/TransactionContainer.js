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

const mapStateToProps = (state) => ({
  transactions: getTransactions(state),
  transactionsById: getTransactionsById(state),
  transactionsForRendering: getTransactionsForRendering(state),
});

@ui({
  state: {
    selected: Immutable.Set(),
    editingTransactionId: null,
    addingTransaction: false,
    hideColumn: (props) => (props.hideAccount ? {'account': true} : {})
  }
})
@connect(mapStateToProps, asyncActionCreatorsFor('transactions'))
class TransactionContainer extends React.Component {

  static propTypes = {
    transactions: React.PropTypes.array.isRequired,
    transactionsById: React.PropTypes.instanceOf(Map).isRequired,
    transactionsForRendering: React.PropTypes.array.isRequired,
    delete: React.PropTypes.func.isRequired,
    accountId: React.PropTypes.number,
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.selectTransaction = this.selectTransaction.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.deleteSelection = this.deleteSelection.bind(this);
    this.displayNew = this.displayNew.bind(this);
    this.displayUpdate = this.displayUpdate.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.toggleColumn = this.toggleColumn.bind(this);
  }

  selectTransaction(id) {
    const current = this.props.ui.selected;
    if (current.includes(id)) {
      this.props.updateUI('selected', current.delete(id));
    } else {
      this.props.updateUI('selected', current.add(id));
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

  getTransactionsToRender() {
    if (this.props.accountId) {
      return this.props.transactionsForRendering.filter(tr => tr.account_id === this.props.accountId);
    }
    return this.props.transactionsForRendering;
  }

  render() {
    const transactionsToRender = this.getTransactionsToRender();
    return (
      <div>
        {(this.props.ui.addingTransaction || this.props.ui.editingTransactionId) &&
        <TransactionForm
          showAccount={true}
          transaction={this.props.transactions.find(tr => tr.id === this.props.ui.editingTransactionId)}
          selectedAccountId={this.props.accountId}
          postSubmit={this.hideForm}
          onCancel={this.hideForm}
        />
        }
        <TransactionToolbar
          selectedRows={this.props.ui.selected}
          clearSelection={this.clearSelection}
          deleteSelection={this.deleteSelection}
          onNewClick={this.displayNew}
          hiddenColumns={this.props.ui.hideColumn}
          toggleColumn={this.toggleColumn}
        />
        <TransactionTable
          transactions={transactionsToRender}
          selectedRows={this.props.ui.selected}
          onSelectRow={this.selectTransaction}
          onPencilClick={this.displayUpdate}
          hiddenColumns={this.props.ui.hideColumn}
        />
      </div>
    );
  }
}

export default TransactionContainer;
