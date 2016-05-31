import React from 'react';

export default class Link extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <button type="button" class="btn btn-primary" onClick={
        e => {
          e.preventDefault();
          this.props.onClick();
        }} >{children}</button>
    );
  }
}
