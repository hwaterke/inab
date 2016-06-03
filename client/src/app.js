import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import transactionReducer from './reducers'
import { applyMiddleware, createStore } from 'redux';
import { render } from 'react-dom';

import React from 'react';
import Main from './components/Main';
import { Provider } from 'react-redux';

const store = createStore(
  transactionReducer,
  applyMiddleware(thunk),
  applyMiddleware(createLogger())
);

render(
  <Provider store={store} >
    <Main />
  </Provider>,
  document.getElementById('app')
);
