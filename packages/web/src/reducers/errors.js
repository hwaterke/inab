import * as types from '../actions/types'

const errorsReducer = (state = [], action) => {
  switch (action.type) {
    case types.ADD_ERROR:
      return state.concat(action.data)
    case types.DISMISS_ERROR:
      return []
    default:
      return state
  }
}

export default errorsReducer
