import cuid from 'cuid'
import {clearToken} from 'inab-shared'
import {path} from 'ramda'
import {createCrudThunks} from 'redux-crud-provider'
import {addError} from '../actions/error'

export const crudThunks = createCrudThunks({
  backendSelector: state => state.credentials.backend,

  cuid: () => cuid(),

  headersSelector: ({credentials}) => {
    if (credentials.token) {
      return {Authorization: credentials.token}
    }
    return {}
  },

  fetchAllDataToRecords: data => data.data,

  onError: (resource, operation, error, dispatch) => {
    if (path(['response', 'status'], error) === 401) {
      return dispatch(clearToken())
    }

    dispatch(addError(`Error: ${operation}:${resource.name} - ${error}`))
  },
})
