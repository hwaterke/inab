import {path} from 'ramda'
import {createCrudThunks} from 'redux-crud-provider'
import {clearToken, selectBackend, selectToken} from 'inab-shared/lib/index'

// Manually generating uuid for now as 'react-native-uuid' has problems
// https://github.com/eugenehp/react-native-uuid/issues/6
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const crudThunks = createCrudThunks({
  backendSelector: state => selectBackend(state),

  cuid: () => uuidv4(),

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

    alert(`Error: ${operation}:${resource.name} - ${error}`)
  },
})
