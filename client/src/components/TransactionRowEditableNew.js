import React from 'react';
import TransactionRowEditable from './TransactionRowEditable';
import ui from 'redux-ui';
import moment from 'moment';
import { connect } from 'react-redux';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import { getSelectedAccount } from '../selectors/ui';

const mapStateToProps = (state) => ({
  selectedAccount: getSelectedAccount(state)
});

@ui({
  state: {
    isTransfer: false
  }
})
@connect(mapStateToProps, asyncActionCreatorsFor('transactions'))
export default class TransactionRowEditableNew extends React.Component {
  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,

    create: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func,
    selectedAccount: React.PropTypes.number.isRequired
  };

  onSubmit(data) {
    var type = 'regular';
    if (data.category == 'tbb') {
      type = 'to_be_budgeted';
    }
    let payee = data.payee;
    let transfer_account_id = null;
    if (data.payee.startsWith("transfer:")) {
      payee = null;
      transfer_account_id = parseInt(data.payee.slice("transfer:".length));
    }
    this.props.create({
      date: data.datee.format("YYYY-MM-DD"),
      transfer_account_id: transfer_account_id,
      payee: payee,
      account_id: this.props.selectedAccount,
      category_id: (data.category != 'tbb' ? data.category : null),
      description: data.description,
      amount: Number(data.amount) * 100,
      type: type
    });
    this.props.updateUI({addingTransaction: false});
  }

  render() {
    const initialValues = { datee: moment() };
    return (<TransactionRowEditable
      initialValues={initialValues}
      onSubmit={::this.onSubmit}
      onCancel={this.props.onCancel}
      selectedAccount={this.props.selectedAccount}
    />);
  }
}
