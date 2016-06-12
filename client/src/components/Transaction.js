import React from 'react';
import FontAwesome from 'react-fontawesome';
import Amount from './Amount';

export default class Transaction extends React.Component {
  static propTypes = {
    date: React.PropTypes.string,
    payee: React.PropTypes.string,
    category: React.PropTypes.string,
    description: React.PropTypes.string,
    amount: React.PropTypes.number,
    selected: React.PropTypes.bool,
    busy: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    inflow_to_be_budgeted: React.PropTypes.bool.isRequired
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
        <td>{this.props.payee}</td>
        <td>
          {this.props.inflow_to_be_budgeted && "TBB"}
          {(!this.props.inflow_to_be_budgeted) && this.props.category}
        </td>
        <td>{this.props.description}</td>
        <td style={{textAlign: 'right'}}><Amount amount={this.props.amount} color /></td>
      </tr>
    );
  }
}
