import React from 'react';

export default class Transaction extends React.Component {
  render() {
    const { id, active, date, payee, category, description, amount, onClick } = this.props;
    const busy = (this.props.busy) ? <span className="glyphicon glyphicon-upload" aria-hidden="true"></span> : <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>;
    return (
      <tr onClick={onClick}>
        <td style={{backgroundColor: active ? "#CCF":"#CFC"}}>{busy}</td>
        <td>{date}</td>
        <td>{payee}</td>
        <td>{category}</td>
        <td>{description}</td>
        <td>{amount}</td>
      </tr>
    );
  }
}
