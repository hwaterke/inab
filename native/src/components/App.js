import React, {Fragment} from 'react'
import {Provider} from 'react-redux'
import {StatusBar} from 'react-native'
import {persistor, store} from '../store/index'
import {PersistGate} from 'redux-persist/es/integration/react'
import {AppContainer} from './AppContainer'

export class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Fragment>
            <StatusBar barStyle="light-content" />
            <AppContainer />
          </Fragment>
        </PersistGate>
      </Provider>
    )
  }
}
