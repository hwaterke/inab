// @flow

type Credentials = {
  backend?: string,
  email?: string,
  is_admin?: boolean,
  token?: ?string,
}

export const setCredentials = (payload: Credentials) => ({
  type: 'SET_CREDENTIALS',
  payload: payload,
})

export const clearToken = () => setCredentials({token: null})

export const credentialsReducer = (state: Credentials = {}, action) => {
  if (action.type === 'SET_CREDENTIALS') {
    return {...state, ...action.payload}
  }
  return state
}
