'use strict';
import React from 'react';

class CategoryGroupRow extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired
  }

  render() {
    return (
      <tr><th colSpan="4">{this.props.name}</th></tr>
    );
  }
}

export default CategoryGroupRow;
