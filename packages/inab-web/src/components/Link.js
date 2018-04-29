import PropTypes from 'prop-types'
import React from 'react'

export default class Link extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
  }

  handleClick = e => {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render() {
    return (
      <a className={this.props.className} onClick={this.handleClick}>
        {this.props.children}
      </a>
    )
  }
}
