const SET_CREDENTIALS = 'SET_CREDENTIALS';

export const setCredentials = payload => ({
  type: 'SET_CREDENTIALS',
  payload
});

export const clearToken = () => setCredentials({token: null});

export const credentialsReducer = (state = {}, action) => {
  if (action.type === SET_CREDENTIALS) {
    const newState = {...state};

    if (action.payload.backend) {
      newState.backend = action.payload.backend;
    }

    if (action.payload.email) {
      newState.email = action.payload.email;
    }

    if (action.payload.token || action.payload.token === null) {
      newState.token = action.payload.token;
    }

    return newState;
  }

  return state;
};
