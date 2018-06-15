import React from 'react'
import {Provider} from 'react-redux'
import {persistStore} from 'redux-persist'
import {AsyncStorage, StatusBar, View} from 'react-native'
import {store} from '../store/index'
import {globalStyles} from '../constants/styles'
import {LoginDispatcher} from './LoginDispatcher'

export class App extends React.Component {
  componentDidMount() {
    persistStore(store, {
      storage: AsyncStorage,
      whitelist: ['credentials', 'resources'],
    })
  }

  render() {
    return (
      <Provider store={store}>
        <View style={globalStyles.flex}>
          <StatusBar barStyle="light-content" />
          <LoginDispatcher />
        </View>
      </Provider>
    )
  }
}
