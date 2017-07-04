import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {credentialsReducer} from './credentials';

export const rootReducer = combineReducers({
  credentials: credentialsReducer,
  form: formReducer
});
