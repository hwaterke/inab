'use strict';
import React from 'react';

const style = {
  backgroundColor: '#85C9E6'
};

class CategoryGroupRow extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired
  }

  render() {
    return (
      <tr><th style={style} colSpan="4">{this.props.name}</th></tr>
    );
  }
}

export default CategoryGroupRow;
