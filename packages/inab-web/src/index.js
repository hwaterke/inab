import React from 'react'
import './styles/index.css'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/modal.css'
import 'font-awesome/css/font-awesome.css'
// eslint-disable-next-line import/default
import configureStore from './store/configureStore'
import {Main} from './components/Main'

const store = configureStore()

render(
  <Provider store={store}>
    <Router>
      <Main />
    </Router>
  </Provider>,
  document.getElementById('app')
)
