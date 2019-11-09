// Polyfills need to be the first import
import './polyfills'

import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.css'
import React, {useEffect, useState} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {ThemeProvider} from 'styled-components'
import {Main} from './components/Main'
import {LoginPage} from './components/screens/login/LoginPage'
import {persistor, store} from './store/store'
import './styles/modal.css'
import {GlobalStyles} from './styles/globalStyles'
import {themes, ThemeSwitcher} from './styles/themes'
import {PersistGate} from 'redux-persist/integration/react'

const Index = () => {
  const [theme, setTheme] = useState(
    window.localStorage.getItem('@inab/theme') || 'light'
  )

  const switchTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  useEffect(() => {
    window.localStorage.setItem('@inab/theme', theme)
  }, [theme])

  return (
    <ThemeProvider theme={themes[theme]}>
      <ThemeSwitcher.Provider value={switchTheme}>
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
      </ThemeSwitcher.Provider>
    </ThemeProvider>
  )
}

render(<Index />, document.getElementById('root'))
