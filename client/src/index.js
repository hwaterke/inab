import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './styles/modal.css';
import 'font-awesome/css/font-awesome.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
// eslint-disable-next-line import/default
import configureStore from './store/configureStore';
import {Main} from './components/Main';
import './styles/main.scss';

// Needed for onTouchTap (material-ui)
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = configureStore();

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router>
        <Main />
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app')
);
