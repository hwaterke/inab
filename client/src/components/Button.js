import React from 'react';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    onClick: React.PropTypes.func,
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
  };

  handleClick(e) {
    e.preventDefault();
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    return (
      <button type="button" disabled={this.props.disabled} className={this.props.className || 'btn btn-secondary'} onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }
}
