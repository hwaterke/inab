import React from 'react';

export default class Transaction extends React.Component {
  render() {
    const { id, date, payee, category, description, amount } = this.props;
    return (
      <tr>
        <td>{id}</td>
        <td>{date}</td>
        <td>{payee}</td>
        <td>{category}</td>
        <td>{description}</td>
        <td>{amount}</td>
      </tr>
    );
  }
}
