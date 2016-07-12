import React from 'react';
import Button from './Button';
import FontAwesome from 'react-fontawesome';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import ui from 'redux-ui';
import { connect } from 'react-redux';
import { getTransactionsById } from '../selectors/transactions';
import Immutable from 'immutable';

const mapStateToProps = (state) => {
  return {
    transactionsById: getTransactionsById(state)
  };
};

@ui()
@connect(mapStateToProps, asyncActionCreatorsFor('transactions'))
export default class TransactionToolbar extends React.Component {
  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
    transactionsById: React.PropTypes.instanceOf(Map).isRequired,
    delete: React.PropTypes.func.isRequired
  };

  deleteTransactions() {
    const records = this.props.ui.selectedTransactions.map((id) => this.props.transactionsById.get(id));
    this.props.updateUI('selectedTransactions', Immutable.Set());
    records.forEach((r) => this.props.delete(r));
  }

  render() {
    return (
      <div>
        <h4>Toolbar</h4>
        { this.props.ui.selectedTransactions.size > 0 && <Button onClick={::this.deleteTransactions}><FontAwesome name='ban' /> ({this.props.ui.selectedTransactions.size})</Button> }
      </div>
    );
  }
}
