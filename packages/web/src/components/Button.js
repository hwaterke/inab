import PropTypes from 'prop-types'
import React from 'react'

export default class Button extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
  }

  handleClick = e => {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render() {
    return (
      <button
        type="button"
        disabled={this.props.disabled}
        className={this.props.className || 'btn btn-secondary'}
        onClick={this.handleClick}
      >
        {this.props.children}
      </button>
    )
  }
}
