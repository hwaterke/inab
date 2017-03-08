// @flow
import React from 'react';
import {connect} from 'react-redux';
import {LoginPage} from './LoginPage';

@connect(state => ({token: state.credentials.token}))
export class LoginDispatcher extends React.Component {

  static propTypes = {
    token: React.PropTypes.string,
    children: React.PropTypes.node,
  };

  render() {
    if (this.props.token) {
      return (
        <div>
          {this.props.children}
        </div>
      );
    }

    return <LoginPage />;
  }
}
