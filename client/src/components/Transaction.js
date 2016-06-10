import React from 'react';

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
    const busy = (this.props.busy) ? <span className="glyphicon glyphicon-upload" aria-hidden="true"></span> : <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>;
    return (
      <tr onClick={this.props.onClick}>
        <td style={{backgroundColor: this.props.selected ? "#CCF":"#CFC"}}>{busy}</td>
        <td>{this.props.date}</td>
        <td>{this.props.payee}</td>
        <td>{this.props.category}</td>
        <td>{this.props.description}</td>
        <td>{this.props.amount}</td>
      </tr>
    );
  }
}
