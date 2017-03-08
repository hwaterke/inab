import React from 'react';
import Header from './Header';
import {EntityLoader} from './EntityLoader';
import ErrorList from './ErrorList';
import {LoginDispatcher} from './LoginDispatcher';

export default class Main extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div>
        <LoginDispatcher>
          <Header />
          <ErrorList />
          <EntityLoader>
            {this.props.children}
          </EntityLoader>
        </LoginDispatcher>
      </div>
    );
  }
}
