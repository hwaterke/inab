import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {resourcesReducer} from 'inab-shared';
import {credentialsReducer} from './credentials';

export const rootReducer = combineReducers({
  credentials: credentialsReducer,
  resources: resourcesReducer,
  form: formReducer
});
