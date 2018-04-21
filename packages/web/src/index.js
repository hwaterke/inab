import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'

import 'bootstrap/scss/bootstrap.scss'
import './styles/modal.css'
import 'font-awesome/css/font-awesome.css'
// eslint-disable-next-line import/default
import configureStore from './store/configureStore'
import {Main} from './components/Main'
import './styles/main.scss'

const store = configureStore()

render(
  <Provider store={store}>
    <Router>
      <Main />
    </Router>
  </Provider>,
  document.getElementById('app')
)
