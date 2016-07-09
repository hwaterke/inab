import React from 'react';
import TransactionToolbar from './TransactionToolbar';
import TransactionTable from './TransactionTable';
import { connect } from 'react-redux';
import {getTransactions} from '../selectors/transactions';

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
class TransactionContainer extends React.Component {
  static propTypes = {
    transactions: React.PropTypes.array.isRequired
  };

  render() {
    return (
      <div>
        <TransactionToolbar />
        <TransactionTable transactions={this.props.transactions} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    transactions: getTransactions(state)
  };
};

export default connect(mapStateToProps)(TransactionContainer);
