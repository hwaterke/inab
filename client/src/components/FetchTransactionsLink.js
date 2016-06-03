import React from 'react';
import actions from '../actions/transactions';
import { connect } from 'react-redux';
import Link from './Link';

export default class FetchTransactionsLink extends React.Component {
  render() {
    return (
      <Link children="Refresh" onClick={this.props.fetch} />
    );
  }
}

export default connect(null, actions)(FetchTransactionsLink);
