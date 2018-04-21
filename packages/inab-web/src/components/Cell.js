import React from 'react'
import PropTypes from 'prop-types'

// Presentational component of a table cell.
export default class Cell extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string,
  }

  render() {
    return (
      <td className={this.props.className} onClick={this.props.onClick}>
        {this.props.children}
      </td>
    )
  }
}
