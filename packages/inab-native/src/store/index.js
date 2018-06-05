import {applyMiddleware, compose, createStore} from 'redux'
import {autoRehydrate} from 'redux-persist'
import thunkMiddleware from 'redux-thunk'
import {rootReducer} from '../reducers/index'

const middlewares = [thunkMiddleware]

export const store = createStore(
  rootReducer,
  undefined,
  compose(applyMiddleware(...middlewares), autoRehydrate())
)
