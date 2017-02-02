import React from 'react';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

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
      <button type="button" className={this.props.className || 'btn btn-secondary'} onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }
}
