// @flow
import {crud as crudCreator} from 'hw-react-shared';
import cuid from 'cuid';
import {clearToken} from '../reducers/credentials';
import {addError} from '../actions/error';
import type {Config} from 'hw-react-shared';

const CrudConfig: Config = {
  backendSelector(state) {
    return state.credentials.backend;
  },

  tokenSelector(state) {
    return state.credentials.token;
  },

  tokenToHeader(token) {
    if (token) {
      return {Authorization: token};
    }
    return {};
  },

  onAuthError({dispatch}) {
    dispatch(clearToken());
  },

  onError({dispatch}, resource, operation, error) {
    dispatch(addError(`Error: ${operation} - ${error}`));
  },

  cuid() {
    return cuid();
  }
};

export const crud = crudCreator(CrudConfig);
