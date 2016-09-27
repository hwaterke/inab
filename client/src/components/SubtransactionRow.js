import React from 'react';
import Amount from './Amount';

export default class SubtransactionRow extends React.Component {
  static propTypes = {
    payee: React.PropTypes.string,
    category: React.PropTypes.string,
    description: React.PropTypes.string,
    amount: React.PropTypes.number,
    onClick: React.PropTypes.func
  };

  render() {
    return (
      <tr onClick={this.props.onClick}>
        <td />
        <td />
        <td>{this.props.payee}</td>
        <td>{this.props.category}</td>
        <td>{this.props.description}</td>
        <td style={{textAlign: 'right'}}><Amount amount={this.props.amount} color /></td>
        <td />
      </tr>
    );
  }
}
