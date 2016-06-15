import React from 'react';

// Presentational component of a table cell.
export default class Cell extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onClick: React.PropTypes.func
  };

  render() {
    return (
      <td onClick={this.props.onClick}>{this.props.children}</td>
    );
  }
}
