import {applyMiddleware, compose, createStore} from 'redux'
import {persistCombineReducers, persistStore} from 'redux-persist'
import storage from 'redux-persist/es/storage'
import thunk from 'redux-thunk'
import {reducers} from '../reducers/index'

const config = {
  key: 'root',
  storage,
  whitelist: ['credentials'],
}

const persistedReducer = persistCombineReducers(config, reducers)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
)

export const persistor = persistStore(store)
