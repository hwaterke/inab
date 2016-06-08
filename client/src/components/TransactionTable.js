import React from 'react';
import { connect } from 'react-redux';
import Transaction from './Transaction';
import EditableTransaction from './EditableTransaction';
import * as actions from '../actions';
import {getTransactions} from '../reducers/transactions'

class TransactionTable extends React.Component {
  render() {
    const { transactions } = this.props;
    const nodes = transactions.map(transaction => {
      return <Transaction
          busy={transaction.busy}
          id={transaction.id}
          active={transaction.active}
          date={transaction.date}
          payee={transaction.payee}
          category={transaction.category}
          description={transaction.description}
          amount={transaction.amount}
          key={transaction.id}
          onClick={() => this.props.selectTransaction(transaction.id) }/>;
    });

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Status</th>
            <th>Date</th>
            <th>Payee</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <EditableTransaction />
          {nodes}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  // TODO Find out why doing map on Immutable does not work
  const tsObj = getTransactions(state).toJS().map(t => {
    return Object.assign({}, t, {active: state.selectedTransactions.includes(t.id)});
  });
  return {
    transactions: tsObj
  };
};

export default connect(mapStateToProps, actions)(TransactionTable);
