import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import TransactionTable from './TransactionTable';
import NewEventLink from './NewEventLink';

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3 col-md-2">
              <Sidebar />
            </div>
            <div className="col-sm-9 col-md-10">
              <NewEventLink />
              <TransactionTable />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
