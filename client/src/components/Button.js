import React from 'react';

export default class Button extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    onClick: React.PropTypes.func
  };

  handleClick(e) {
    e.preventDefault();
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    return (
      <button type="button" className="btn btn-default" onClick={::this.handleClick}>
        {this.props.children}
      </button>
    );
  }
}
