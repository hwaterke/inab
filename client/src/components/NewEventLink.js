import React from 'react';
import { connect } from 'react-redux';
import Link from './Link';
import actions from '../actions/transactions';
import Immutable from 'seamless-immutable';
import cuid from 'cuid';

class NewEventLink extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const names = ['Alice', 'Bob', 'Eve'];
    var payee = names[Math.floor(Math.random() * names.length)];
    const amount = Math.round(Math.random() * 500);
    return this.props.add({
      id: cuid(),
      date: "12/12/2016",
      payee: payee,
      category: "Category",
      description: "Description",
      amount: amount
    });
  }

  render() {
    return (
      <Link children={"New transaction"} onClick={this.handleClick} />
    );
  }
}

export default connect(null, actions)(NewEventLink);
