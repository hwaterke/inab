import React from 'react';
import {Switch, Route} from 'react-router-dom';

import {Header} from './navbar/Header';
import {EntityLoader} from './EntityLoader';
import ErrorList from './ErrorList';
import {LoginDispatcher} from './LoginDispatcher';
import LandingPage from './LandingPage';
import {AccountPage} from './screens/accounts/AccountPage';
import {BudgetPage} from './screens/budget/BudgetPage';
import {PayeeList} from './screens/payees/PayeeList';
import {PayeeDetail} from './screens/payees/PayeeDetail';
import {AccountList} from './screens/accounts/AccountList';
import {AccountDetail} from './screens/accounts/AccountDetail';

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
              <Route exact path="/payees/new" component={PayeeDetail} />
              <Route exact path="/payees/edit/:uuid" component={PayeeDetail} />

              <Route exact path="/accounts" component={AccountList} />
              <Route exact path="/accounts/new" component={AccountDetail} />
              <Route exact path="/accounts/edit/:uuid" component={AccountDetail} />

              <Route exact path="/account/:uuid?" component={AccountPage} />
              <Route path="/account/:date/:category_uuid" component={AccountPage} />
            </Switch>
          </EntityLoader>
        </LoginDispatcher>
      </div>
    );
  }
}
