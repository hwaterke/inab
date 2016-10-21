import React from 'react';

const style = {
  backgroundColor: '#85C9E6'
};

class CategoryGroupRow extends React.Component {
  static propTypes = {
    categoryGroup: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired
    }).isRequired,
    onClick: React.PropTypes.func
  }

  render() {
    return (
      <tr>
        <th style={style} colSpan="4" onClick={this.props.onClick}>{this.props.categoryGroup.name}</th>
      </tr>
    );
  }
}

export default CategoryGroupRow;
