import * as types from './types';

export const selectPage = (name, data) => ({
  type: types.SELECT_PAGE,
  name: name,
  data: data
});
