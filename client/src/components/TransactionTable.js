import React from 'react';
import { connect } from 'react-redux';
import TransactionRow from './TransactionRow';
import TransactionRowEditableNew from './TransactionRowEditableNew';
import SubtransactionRow from './SubtransactionRow';
import {getCategoriesById} from '../selectors/categories';
import {getAccountsById} from '../selectors/accounts';
import ui from 'redux-ui';

/*
props.ui.editingTransactionId: Mot used yet but will be for inline editing of existing transactions
*/
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
    if (this.props.ui.addingTransaction) {
      rows.push(<TransactionRowEditableNew key='add' showAccount={this.props.showAccount} />);
    }

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

      t.subtransactions.forEach((st) => {
        rows.push(<SubtransactionRow
            key={'sub' + st.id}
            subtransaction={st}

            showAccount={this.props.showAccount}
            categoryLabel={this.props.categoriesById.get(st.category_id) && this.props.categoriesById.get(st.category_id).name}

            onClick={() => this.props.selectTransaction(t.id) }
          />);
      });
    });

    return (
      <table className="table">
        <thead>
          <tr>
            <th />
            {this.props.showAccount && <th>Account</th>}
            <th>Date</th>
            <th>Payee</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
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

const mapStateToProps = (state) => {
  return {
    categoriesById: getCategoriesById(state),
    accountsById: getAccountsById(state)
  };
};

export default connect(mapStateToProps)(TransactionTable);
