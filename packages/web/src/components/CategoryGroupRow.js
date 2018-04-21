import React from 'react';
import PropTypes from 'prop-types';
import {CategoryGroupResource} from 'inab-shared';

const style = {
  backgroundColor: '#85C9E6'
};

class CategoryGroupRow extends React.Component {
  static propTypes = {
    categoryGroup: CategoryGroupResource.propType.isRequired,
    onClick: PropTypes.func
  };

  render() {
    return (
      <tr>
        <th style={style} colSpan="4" onClick={this.props.onClick}>
          {this.props.categoryGroup.name}
        </th>
      </tr>
    );
  }
}

export default CategoryGroupRow;
