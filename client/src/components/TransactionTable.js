import React from 'react';
import { connect } from 'react-redux';
import TransactionRow from './TransactionRow';
import TransactionRowEditable from './TransactionRowEditable';
import {getCategoriesById} from '../selectors/categories';
import {getAccountsById} from '../selectors/accounts';
import ui from 'redux-ui';

@ui()
class TransactionTable extends React.Component {
  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    transactions: React.PropTypes.array.isRequired,
    categoriesById: React.PropTypes.instanceOf(Map).isRequired,
    accountsById: React.PropTypes.instanceOf(Map).isRequired,
    selectTransaction: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th />
            <th>Date</th>
            <th>Payee</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <TransactionRowEditable />
          { this.props.transactions.map(t =>
            <TransactionRow
              busy={t.busy}
              id={t.id}
              date={t.date}
              payee={t.payee}
              category={this.props.categoriesById.get(t.category_id) && this.props.categoriesById.get(t.category_id).name}
              description={t.description}
              amount={t.amount}
              transfer_account={t.transfer_account_id && this.props.accountsById.get(t.transfer_account_id).name}
              selected={this.props.ui.selectedTransactions.has(t.id)}
              key={t.id}
              inflow_to_be_budgeted={t.inflow_to_be_budgeted}
              onClick={() => this.props.selectTransaction(t.id) }/>)
            }
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
