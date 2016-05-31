import React from 'react';
import { connect } from 'react-redux';
import Transaction from './Transaction';

class TransactionTable extends React.Component {
  render() {
    const { transactions } = this.props;

    const nodes = transactions.map(transaction =>
            <Transaction
              id={transaction.id}
              date={transaction.date}
              payee={transaction.payee}
              category={transaction.category}
              description={transaction.description}
              amount={transaction.amount}
              key={transaction.id}/>
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
          {nodes}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    transactions: Object.keys(state['entities']['transactions']).map(key => state['entities']['transactions'][key])
  };
};

export default connect(mapStateToProps)(TransactionTable);
