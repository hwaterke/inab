import React from 'react';
import { connect } from 'react-redux';
import Button from './Button';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';

export default class FetchTransactionsButton extends React.Component {
  render() {
    return (
      <Button children="Refresh" onClick={this.props.fetch} />
    );
  }
}

FetchTransactionsButton.propTypes = {
  fetch: React.PropTypes.func.isRequired
};

export default connect(null, asyncActionCreatorsFor('transactions'))(FetchTransactionsButton);
