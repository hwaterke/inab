import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../store/index';
import {LoginDispatcher} from './LoginDispatcher';
import {persistStore} from 'redux-persist';
import {AsyncStorage, View, StatusBar} from 'react-native';
import {globalStyles} from '../constants/styles';

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
        <View style={globalStyles.flex}>
          <StatusBar barStyle="light-content" />
          <LoginDispatcher />
        </View>
      </Provider>
    );
  }
}
