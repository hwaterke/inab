import React from 'react';
import actions from '../actions/transactions';
import { connect } from 'react-redux';
import Button from './Button';

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

export default connect(null, actions)(FetchTransactionsButton);
