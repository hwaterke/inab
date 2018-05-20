import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Main} from './components/Main'
import {LoginPage} from './components/screens/login/LoginPage'
// eslint-disable-next-line import/default
import configureStore from './store/configureStore'
import './styles/index.css'
import './styles/modal.css'

const store = configureStore()

render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={LoginPage} />
        <Route component={Main} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('app')
)
