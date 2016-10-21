import { render } from 'react-dom';
import React from 'react';
import Main from './components/Main';
import { Provider } from 'react-redux';
import './styles/modal.css';
import 'font-awesome/css/font-awesome.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import configureStore from './store/configureStore';

injectTapEventPlugin();

const store = configureStore();

render(
  <Provider store={store} >
    <MuiThemeProvider>
      <Main />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app')
);
