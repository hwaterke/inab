import {applyMiddleware, compose, createStore} from 'redux'
import {rootReducer} from '../reducers/index'
import {autoRehydrate} from 'redux-persist'
import thunkMiddleware from 'redux-thunk'

const middlewares = [thunkMiddleware]

export const store = createStore(
  rootReducer,
  undefined,
  compose(applyMiddleware(...middlewares), autoRehydrate())
)
