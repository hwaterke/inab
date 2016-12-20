import React from "react";
import TransactionToolbar from "./TransactionToolbar";
import TransactionTable from "./TransactionTable";
import Immutable from "immutable";
import ui from "redux-ui";

@ui({
  state: {
    selectedTransactions: Immutable.Set(),
    editingTransactionId: null,
    addingTransaction: false,
    showAccount: false
  }
})
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
          showAccount={this.props.ui.showAccount}
          selectTransaction={(id) => this.selectTransaction(id) }
        />
      </div>
    );
  }
}
