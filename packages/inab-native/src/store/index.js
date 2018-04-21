import {createStore} from 'redux'
import {rootReducer} from '../reducers/index'
import {autoRehydrate} from 'redux-persist'

export const store = createStore(rootReducer, autoRehydrate())
