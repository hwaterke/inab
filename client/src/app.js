import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import transactionReducer from './reducers'
import Main from './components/Main';
import createLogger from 'redux-logger';

const logger = createLogger();
const store = createStore(
  transactionReducer,
  applyMiddleware(logger)
);

render(
  <Provider store={store} >
    <Main />
  </Provider>,
  document.getElementById('app')
);
