import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {EntityLoader} from './EntityLoader'
import ErrorList from './ErrorList'
import {LoginDispatcher} from './LoginDispatcher'
import {NavBar} from './navbar/NavBar'
import {AccountDetail} from './screens/accounts/AccountDetail'
import {AccountList} from './screens/accounts/AccountList'
import {AccountPage} from './screens/accounts/AccountPage'
import {AdminPage} from './screens/admin/AdminPage'
import {BudgetPage} from './screens/budget/BudgetPage'
import {CategoryDetail} from './screens/categories/CategoryDetail'
import {CategoryGroupDetail} from './screens/category_groups/CategoryGroupDetail'
import {PayeeDetail} from './screens/payees/PayeeDetail'
import {PayeeList} from './screens/payees/PayeeList'

export class Main extends React.Component {
  render() {
    return (
      <LoginDispatcher>
        <NavBar />
        <ErrorList />
        <EntityLoader>
          <Switch>
            <Route exact path="/" component={BudgetPage} />

            <Route exact path="/admin" component={AdminPage} />

            <Route exact path="/payees" component={PayeeList} />
            <Route exact path="/payees/new" component={PayeeDetail} />
            <Route exact path="/payees/edit/:uuid" component={PayeeDetail} />

            <Route exact path="/accounts" component={AccountList} />
            <Route exact path="/accounts/new" component={AccountDetail} />
            <Route
              exact
              path="/accounts/edit/:uuid"
              component={AccountDetail}
            />

            <Route exact path="/categories/new" component={CategoryDetail} />
            <Route
              exact
              path="/categories/edit/:uuid"
              component={CategoryDetail}
            />

            <Route
              exact
              path="/category-groups/new"
              component={CategoryGroupDetail}
            />
            <Route
              exact
              path="/category-groups/edit/:uuid"
              component={CategoryGroupDetail}
            />

            <Route exact path="/account/:uuid?" component={AccountPage} />
            <Route
              path="/account/:date/:category_uuid"
              component={AccountPage}
            />
          </Switch>
        </EntityLoader>
      </LoginDispatcher>
    )
  }
}
