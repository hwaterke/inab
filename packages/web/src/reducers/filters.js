const ADD_FILTER = 'ADD_FILTER'
const DELETE_FILTER = 'DELETE_FILTER'
const SET_FILTER = 'SET_FILTER'

export const addFilter = filter => ({
  type: ADD_FILTER,
  filter,
})

export const deleteFilter = index => ({
  type: DELETE_FILTER,
  index,
})

export const setFilter = filters => ({
  type: SET_FILTER,
  filters,
})

export function transactionFiltersReducer(state = [], action) {
  switch (action.type) {
    case ADD_FILTER:
      return state.concat(action.filter)
    case DELETE_FILTER:
      return state.filter((_, i) => i !== action.index)
    case SET_FILTER:
      return action.filters
    default:
      return state
  }
}
