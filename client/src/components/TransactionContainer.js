import React from 'react';
import TransactionToolbar from './TransactionToolbar';
import TransactionTable from './TransactionTable';
import { connect } from 'react-redux';
import {getTransactions} from '../selectors/transactions';
import Immutable from 'immutable';
import ui from 'redux-ui';

/*
Brainstorming
Props:
  * Array of transactions
  * Show account name by default

UI State:
  * Show account name t/f
  * Selected transactions

TransactionContainer (props: transactions, showAccountByDefault; ui: showAccount, selectedTransactions)
  TransactionToolbar (ui: selectedTransactions, showAccount)
  TransactionTable (props: transactions, showAccount)
    TransactionRowHeader
    TransactionRow
    TransactionRow
    TransactionRow
    TransactionRow
*/

const mapStateToProps = (state) => {
  return {
    transactions: getTransactions(state)
  };
};


@ui({
  state: {
    selectedTransactions: Immutable.Set(),
    editingTransactionId: null,
    addingTransaction: false
  }
})
@connect(mapStateToProps)
export default class TransactionContainer extends React.Component {
  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
    transactions: React.PropTypes.array.isRequired
  };

  selectTransaction(id) {
    const current = this.props.ui.selectedTransactions;
    if (current.includes(id)) {
      this.props.updateUI('selectedTransactions', current.delete(id));
    } else {
      this.props.updateUI('selectedTransactions', current.add(id));
    }
  }

  render() {
    return (
      <div>
        <TransactionToolbar />
        <TransactionTable
          transactions={this.props.transactions}
          selectTransaction={(id) => this.selectTransaction(id) }
        />
      </div>
    );
  }
}
