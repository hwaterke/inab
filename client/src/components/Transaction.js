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
    onClick: React.PropTypes.func
  };

  render() {
    return (
      <tr onClick={this.props.onClick}>
        <td style={{backgroundColor: this.props.selected ? "#CCF":"#CFC"}}>{this.props.busy && <FontAwesome name='refresh' spin />}</td>
        <td>{this.props.date}</td>
        <td>{this.props.payee}</td>
        <td>{this.props.category}</td>
        <td>{this.props.description}</td>
        <td style={{textAlign: 'right'}}><Amount amount={this.props.amount} /></td>
      </tr>
    );
  }
}
