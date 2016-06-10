'use strict';
import React from 'react';

class CategoryRow extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    activity: React.PropTypes.number
  }

  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td></td>
        <td>{this.props.activity}</td>
        <td />
      </tr>
    );
  }
}

export default CategoryRow;
