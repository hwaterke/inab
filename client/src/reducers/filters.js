import {Filter} from '../entities/Filter';

const ADD_FILTER = 'ADD_FILTER';
const DELETE_FILTER = 'DELETE_FILTER';

export const addFilter = (filter) => ({
  type: ADD_FILTER,
  filter
});

export const deleteFilter = (index) => ({
  type: DELETE_FILTER,
  index
});

export function transactionFiltersReducer(state = [], action) {
  switch (action.type) {
    case "ADD_FILTER":
      return state.concat(action.filter);
    case "DELETE_FILTER": {
      return state.filter((_, i) => i !== action.index);
    }
    case "@@router/LOCATION_CHANGE": {
      let result = action.payload.pathname.match(/^\/account\/(\d{4}-\d{2})\/(\d+)$/i);
      if (result) {
        return [
          new Filter('date', ':', result[1]),
          new Filter('category_id', '=', parseInt(result[2]))
        ];
      }
      // Reset on page change (for now TODO)
      return [];
    }
  }
  return state;
}
