import React from 'react';
import { connect } from 'react-redux';
import Link from './Link';
import { addTransaction } from '../actions';

class NewEventLink extends React.Component {
  render() {
    return (
      <Link children={"New transaction"} onClick={this.props.onClick} />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      const names = ['Alice', 'Bob', 'Eve'];
      var payee = names[Math.floor(Math.random() * names.length)];
      const amount = Math.round(Math.random() * 500);
      dispatch(addTransaction("12/12/2016", payee, "Category", "Description", amount));
    }
  };
};

export default connect(null, mapDispatchToProps)(NewEventLink);
