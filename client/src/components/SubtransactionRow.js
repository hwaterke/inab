import React from 'react';
import Amount from './Amount';

export default class SubtransactionRow extends React.Component {
  static propTypes = {
    subtransaction: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      payee: React.PropTypes.string,
      category_id: React.PropTypes.number,
      description: React.PropTypes.string,
      amount: React.PropTypes.number
    }),
    categoryLabel: React.PropTypes.string,
    onClick: React.PropTypes.func
  };

  render() {
    return (
      <tr onClick={this.props.onClick}>
        <td />
        <td />
        <td>{this.props.subtransaction.payee}</td>
        <td>{this.props.categoryLabel}</td>
        <td>{this.props.subtransaction.description}</td>
        <td style={{textAlign: 'right'}}><Amount amount={this.props.subtransaction.amount} color /></td>
        <td />
      </tr>
    );
  }
}
