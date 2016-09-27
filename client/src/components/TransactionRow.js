import React from 'react';
import FontAwesome from 'react-fontawesome';
import Amount from './Amount';
import Link from './Link';

export default class TransactionRow extends React.Component {
  static propTypes = {
    date: React.PropTypes.string,
    payee: React.PropTypes.string,
    category: React.PropTypes.string,
    description: React.PropTypes.string,
    amount: React.PropTypes.number,
    selected: React.PropTypes.bool,
    busy: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    type: React.PropTypes.string.isRequired,
    transfer_account: React.PropTypes.string,
    handlePencilClick: React.PropTypes.func
  };

  render() {
    return (
      <tr onClick={this.props.onClick}>
        <td>
          {this.props.busy && <FontAwesome name='refresh' spin />}
          {this.props.selected && <FontAwesome name='check-circle-o' />}
          {(!this.props.selected) && <FontAwesome name='circle-o' />}
        </td>
        <td>{this.props.date}</td>
        <td>
          {this.props.payee || (this.props.transfer_account && <div><FontAwesome name='exchange' /> {this.props.transfer_account}</div>)}
        </td>
        <td>
          {this.props.type == 'to_be_budgeted' && "To be budgeted"}
          {this.props.type == 'regular' && this.props.category}
          {this.props.type == 'split' && "Split"}
        </td>
        <td>{this.props.description}</td>
        <td style={{textAlign: 'right'}}><Amount amount={this.props.amount} color /></td>
        <td><Link onClick={this.props.handlePencilClick}><FontAwesome name='pencil' /></Link></td>
      </tr>
    );
  }
}
