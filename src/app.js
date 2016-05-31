import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import transactionReducer from './reducers'
import Main from './components/Main';

let store = createStore(transactionReducer);

render(
  <Provider store={store} >
    <Main />
  </Provider>,
  document.getElementById('app')
);
