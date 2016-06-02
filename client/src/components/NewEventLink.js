import React from 'react';
import { connect } from 'react-redux';
import Link from './Link';
import * as actions from '../actions';

class NewEventLink extends React.Component {
  render() {
    return (
      <Link children={"New transaction"} onClick={this.props.addRandomTransaction} />
    );
  }
}

export default connect(null, actions)(NewEventLink);
