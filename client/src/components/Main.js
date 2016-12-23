import React from "react";
import Header from "./Header";
import EntityLoader from "./EntityLoader";
import ErrorList from "./ErrorList";

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
          <div className="container-fluid">
            <div className="row">
              {this.props.children}
            </div>
          </div>
        </EntityLoader>
      </div>
    );
  }
}
