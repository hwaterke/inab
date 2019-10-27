// Polyfills need to be the first import
import './polyfills'

import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {ThemeProvider} from 'styled-components'
import {Main} from './components/Main'
import {LoginPage} from './components/screens/login/LoginPage'
import {persistor, store} from './store/store'
import './styles/modal.css'
import {ligthTheme} from './styles/themes'
import {GlobalStyles} from './styles/globalStyles'
import {PersistGate} from 'redux-persist/integration/react'

const Index = () => {
  return (
    <ThemeProvider theme={ligthTheme}>
      <GlobalStyles />
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
      </Provider>
    </ThemeProvider>
  )
}

render(<Index />, document.getElementById('root'))
