import React from 'react';
import { connect } from 'react-redux';
import Transaction from './Transaction';
import EditableTransaction from './EditableTransaction';
import * as actions from '../actions';

class TransactionTable extends React.Component {
  render() {
    const { transactions } = this.props;

    const nodes = transactions.map(transaction =>
            <Transaction
              id={transaction.id}
              active={transaction.active}
              date={transaction.date}
              payee={transaction.payee}
              category={transaction.category}
              description={transaction.description}
              amount={transaction.amount}
              key={transaction.id}
              onClick={() => this.props.selectTransaction(transaction.id) }/>
        );

    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
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
  const tsObj = state['entities']['transactions'];
  const ts = Object.keys(tsObj).map(key => tsObj[key]);
  ts.forEach(t => { t['active'] = state['selectedTransactions'].includes(t.id); });
  return {
    transactions: ts
  };
};

export default connect(mapStateToProps, actions)(TransactionTable);
