import React from "react";
import {connect} from "react-redux";
import TransactionRow from "./TransactionRow";
import SubtransactionRow from "./SubtransactionRow";
import {getCategoriesById} from "../selectors/categories";
import {getAccountsById} from "../selectors/accounts";
import ui from "redux-ui";
import "../styles/tables.scss";

@ui()
class TransactionTable extends React.Component {
  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,

    transactions: React.PropTypes.array.isRequired,

    categoriesById: React.PropTypes.instanceOf(Map).isRequired,
    accountsById: React.PropTypes.instanceOf(Map).isRequired,

    showAccount: React.PropTypes.bool.isRequired,

    selectTransaction: React.PropTypes.func.isRequired
  };

  render() {
    const rows = [];

    this.props.transactions.forEach(t => {
      rows.push(<TransactionRow
        key={t.id}
        transaction={t}

        showAccount={this.props.showAccount}
        categoryLabel={this.props.categoriesById.get(t.category_id) && this.props.categoriesById.get(t.category_id).name}
        accountLabel={this.props.accountsById.get(t.account_id).name}
        transferAccountLabel={t.transfer_account_id && this.props.accountsById.get(t.transfer_account_id).name}

        selected={this.props.ui.selectedTransactions.has(t.id)}
        onClick={() => this.props.selectTransaction(t.id) }
        handlePencilClick={() => this.props.updateUI({editingTransactionId: t.id, addingTransaction: false}) }
      />);

      t.subtransactions.forEach((st, stIndex) => {
        rows.push(<SubtransactionRow
          key={'sub' + (st.id || ('index' + stIndex))}
          subtransaction={st}

          showAccount={this.props.showAccount}
          categoryLabel={this.props.categoriesById.get(st.category_id) && this.props.categoriesById.get(st.category_id).name}

          selected={this.props.ui.selectedTransactions.has(t.id)}
          onClick={() => this.props.selectTransaction(t.id) }
        />);
      });
    });

    return (
      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th />
            {this.props.showAccount && <th>Account</th>}
            <th>Date</th>
            <th>Payee</th>
            <th>Category</th>
            <th>Description</th>
            <th className="right">Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => ({
  categoriesById: getCategoriesById(state),
  accountsById: getAccountsById(state)
});

export default connect(mapStateToProps)(TransactionTable);
