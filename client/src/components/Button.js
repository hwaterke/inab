import React from 'react';

export default class Button extends React.Component {
  render() {
    const { children, onClick } = this.props;
    return (
      <button type="button" className="btn btn-primary" onClick={
        e => {
          e.preventDefault();
          onClick();
        }} >{children}</button>
    );
  }
}

Button.propTypes = {
  children: React.PropTypes.node.isRequired,
  onClick: React.PropTypes.func.isRequired
};
