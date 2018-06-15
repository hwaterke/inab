// Polyfills need to be the first import
import './polyfills'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Main} from './components/Main'
import {LoginPage} from './components/screens/login/LoginPage'
import {persistor, store} from './store/store'
import {PersistGate} from 'redux-persist/integration/react'
import './styles/index.css'
import './styles/modal.css'

render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading="Loading...">
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={LoginPage} />
          <Route component={Main} />
        </Switch>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('app')
)
