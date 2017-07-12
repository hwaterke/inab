import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../store/index';
import {LoginDispatcher} from './LoginDispatcher';
import {persistStore} from 'redux-persist';
import {AsyncStorage} from 'react-native';

export class App extends React.Component {
  componentDidMount() {
    persistStore(store, {
      storage: AsyncStorage,
      whitelist: ['credentials', 'resources']
    });
  }

  render() {
    return (
      <Provider store={store}>
        <LoginDispatcher />
      </Provider>
    );
  }
}
