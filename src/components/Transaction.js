import React from 'react';

export default class Transaction extends React.Component {
  render() {
    const { id, active, date, payee, category, description, amount, onClick } = this.props;
    return (
      <tr onClick={onClick}>
        <td style={{backgroundColor: active ? "#CCF":"#CFC"}}>{id}</td>
        <td>{date}</td>
        <td>{payee}</td>
        <td>{category}</td>
        <td>{description}</td>
        <td>{amount}</td>
      </tr>
    );
  }
}
