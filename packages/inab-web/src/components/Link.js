import React from 'react'
import PropTypes from 'prop-types'

export default class Link extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
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
