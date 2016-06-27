import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducers';
import { applyMiddleware, createStore } from 'redux';
import { render } from 'react-dom';
import ReduxModal from 'react-redux-modal';
import React from 'react';
import Main from './components/Main';
import { Provider } from 'react-redux';

const store = createStore(
  reducer,
  applyMiddleware(thunk, createLogger())
);

render(
  <Provider store={store} >
    <div>
      <Main />
      <ReduxModal />
    </div>
  </Provider>,
  document.getElementById('app')
);
