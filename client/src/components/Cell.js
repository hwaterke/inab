import React from 'react';

// Presentational component of a table cell.
export default class Cell extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onClick: React.PropTypes.func,
    className: React.PropTypes.string
  };

  render() {
    return (
      <td className={this.props.className} onClick={this.props.onClick}>{this.props.children}</td>
    );
  }
}
