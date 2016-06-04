import React from 'react';
import Link from './Link';
import * as actions from '../actions/page';
import { connect } from 'react-redux';

class Sidebar extends React.Component {
  render() {
    return (
      <ul className="nav sidebar-nav">
        <li><Link children="Budget" onClick={() => this.props.selectPage('BUDGET')} /></li>
        <li><Link children="Account 1" onClick={() => this.props.selectPage('ACCOUNT')} /></li>
        <li><Link children="Account 2" onClick={() => this.props.selectPage('ACCOUNT')} /></li>
      </ul>
    );
  }
}

Sidebar.propTypes = {
  selectPage: React.PropTypes.func.isRequired
};

export default connect(null, actions)(Sidebar);
