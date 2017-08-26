import React from 'react';
import {Header} from './Header';
import {EntityLoader} from './EntityLoader';
import ErrorList from './ErrorList';
import {LoginDispatcher} from './LoginDispatcher';
import {Switch, Route} from 'react-router-dom';
import LandingPage from './LandingPage';
import BudgetPage from './Budget';
import {AccountPage} from './AccountPage';

export class Main extends React.Component {
  render() {
    return (
      <div>
        <LoginDispatcher>
          <Header />
          <ErrorList />
          <EntityLoader>
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route path="/budget" component={BudgetPage} />
              <Route exact path="/account/:uuid?" component={AccountPage} />
              <Route path="/account/:date/:category_uuid" component={AccountPage} />
            </Switch>
          </EntityLoader>
        </LoginDispatcher>
      </div>
    );
  }
}
