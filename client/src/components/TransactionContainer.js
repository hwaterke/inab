import React from "react";
import TransactionToolbar from "./TransactionToolbar";
import TransactionTable from "./TransactionTable";
import Immutable from "immutable";
import ui from "redux-ui";
import TransactionForm from "./forms/TransactionForm";
import {connect} from "react-redux";
import {getSelectedAccount} from "../selectors/ui";

const mapStateToProps = (state) => ({selectedAccount: getSelectedAccount(state)});

@ui({
  state: {
    selectedTransactions: Immutable.Set(),
    editingTransactionId: null,
    addingTransaction: false,
    showAccount: false
  }
})
@connect(mapStateToProps)
export default class TransactionContainer extends React.Component {
  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
    transactions: React.PropTypes.array.isRequired,
    selectedAccount: React.PropTypes.number,
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
        {(this.props.ui.addingTransaction || this.props.ui.editingTransactionId) &&
        <TransactionForm
          showAccount={this.props.ui.showAccount}
          transaction={this.props.transactions.find(tr => tr.id === this.props.ui.editingTransactionId)}
          selectedAccountId={this.props.selectedAccount}
          postSubmit={() => this.props.updateUI({editingTransactionId: null, addingTransaction: false}) }
          onCancel={() => this.props.updateUI({editingTransactionId: null, addingTransaction: false}) }
        />
        }
        <TransactionToolbar />
        <TransactionTable
          transactions={this.props.transactions}
          showAccount={this.props.ui.showAccount}
          selectTransaction={id => this.selectTransaction(id) }
        />
      </div>
    );
  }
}
