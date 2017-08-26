import React from 'react';
import {Switch, Route} from 'react-router-dom';

import {Header} from './navbar/Header';
import {EntityLoader} from './EntityLoader';
import ErrorList from './ErrorList';
import {LoginDispatcher} from './LoginDispatcher';
import LandingPage from './LandingPage';
import {AccountPage} from './AccountPage';
import {BudgetPage} from './screens/budget/BudgetPage';
import {PayeeList} from './screens/payees/PayeeList';
import {PayeeDetail} from './screens/payees/PayeeDetail';

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
              <Route exact path="/payees" component={PayeeList} />
              <Route path="/payees/:uuid" component={PayeeDetail} />
              <Route exact path="/account/:uuid?" component={AccountPage} />
              <Route path="/account/:date/:category_uuid" component={AccountPage} />
            </Switch>
          </EntityLoader>
        </LoginDispatcher>
      </div>
    );
  }
}
