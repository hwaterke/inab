import React from 'react';
import FontAwesome from 'react-fontawesome';
import Amount from './Amount';
import Link from './Link';

export default class TransactionRow extends React.Component {
  static propTypes = {

    transaction: React.PropTypes.shape({
      account_id: React.PropTypes.number.isRequired,
      date: React.PropTypes.string.isRequired,
      payee: React.PropTypes.string,
      category_id: React.PropTypes.number,
      description: React.PropTypes.string,
      amount: React.PropTypes.number,
      type: React.PropTypes.string.isRequired,

      busy: React.PropTypes.bool
    }),

    categoryLabel: React.PropTypes.string,
    accountLabel: React.PropTypes.string,
    transferAccountLabel: React.PropTypes.string,
    showAccount: React.PropTypes.bool.isRequired,

    selected: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    handlePencilClick: React.PropTypes.func
  };

  render() {
    return (
      <tr onClick={this.props.onClick} className={this.props.selected && 'table-active'}>
        <td>
          {this.props.transaction.busy && <FontAwesome name='refresh' spin />}
          {this.props.selected && <FontAwesome name='check-circle-o' />}
          {(!this.props.selected) && <FontAwesome name='circle-o' />}
        </td>
        {this.props.showAccount && <td>{this.props.accountLabel}</td>}
        <td>{this.props.transaction.date}</td>
        <td>
          {this.props.transaction.payee || (this.props.transferAccountLabel && <div><FontAwesome name='exchange' /> {this.props.transferAccountLabel}</div>)}
        </td>
        <td>
          {this.props.transaction.type == 'to_be_budgeted' && "To be budgeted"}
          {this.props.transaction.type == 'regular' && this.props.categoryLabel}
          {this.props.transaction.type == 'split' && "Split"}
        </td>
        <td>{this.props.transaction.description}</td>
        <td style={{textAlign: 'right'}}><Amount amount={this.props.transaction.amount} color /></td>
        <td><Link onClick={this.props.handlePencilClick}><FontAwesome name='pencil' /></Link></td>
      </tr>
    );
  }
}
