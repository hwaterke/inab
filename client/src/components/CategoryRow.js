'use strict';
import React from 'react';

class CategoryRow extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired
  }

  render() {
    return (
      <tr><td colSpan="4">{this.props.name}</td></tr>
    );
  }
}

export default CategoryRow;
