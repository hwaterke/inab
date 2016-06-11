import React from 'react';

export default class Link extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    onClick: React.PropTypes.func,
    className: React.PropTypes.string
  };

  handleClick(e) {
    e.preventDefault();
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    return (
      <a href='#' className={this.props.className} onClick={::this.handleClick}>{this.props.children}</a>
    );
  }
}
