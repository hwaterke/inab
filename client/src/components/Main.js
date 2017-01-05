import React from 'react';
import Header from './Header';
import EntityLoader from './EntityLoader';
import ErrorList from './ErrorList';

export default class Main extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div>
        <Header />
        <ErrorList />
        <EntityLoader>
          {this.props.children}
        </EntityLoader>
      </div>
    );
  }
}
