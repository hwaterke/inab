// @flow
import {crud as crudCreator} from 'hw-react-shared'
import {clearToken} from '../../reducers/credentials'
import type {Config} from 'hw-react-shared'

// Manually generating uuid for now as 'react-native-uuid' has problems
// https://github.com/eugenehp/react-native-uuid/issues/6
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const CrudConfig: Config = {
  backendSelector(state) {
    return `${state.credentials.backend}/api`
  },

  tokenSelector(state) {
    return state.credentials.token
  },

  tokenToHeader(token) {
    if (token) {
      return {Authorization: token}
    }
    return {}
  },

  onAuthError({dispatch}) {
    dispatch(clearToken())
  },

  onError(props, resource, operation, error) {
    alert(`Error: ${operation} - ${error}`)
  },

  cuid() {
    return uuidv4()
  },
}

export const crud = crudCreator(CrudConfig)
