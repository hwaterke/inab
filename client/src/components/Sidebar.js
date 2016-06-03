import React from 'react';

export default class Sidebar extends React.Component {
  render() {
    return (
      <ul className="nav sidebar-nav">
        <li><a href="#">Budget</a></li>
        <li><a href="#">Account 1</a></li>
        <li><a href="#">Account 2</a></li>
      </ul>
    );
  }
}
