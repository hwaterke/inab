import cuid from 'cuid'
import {clearToken, selectBackend, selectToken} from 'inab-shared'
import {path} from 'ramda'
import {createCrudThunks} from 'redux-crud-provider'
import {addError} from '../actions/error'

export const crudThunks = createCrudThunks({
  backendSelector: state => selectBackend(state),

  cuid: () => cuid(),

  headersSelector: state => {
    const token = selectToken(state)
    if (token) {
      return {Authorization: token}
    }
    return {}
  },

  onError: (resource, operation, error, dispatch) => {
    if (path(['response', 'status'], error) === 401) {
      return dispatch(clearToken())
    }

    dispatch(addError(`Error: ${operation}:${resource.name} - ${error}`))
  },
})
