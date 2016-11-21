import * as types from './types';

export const addError = (content) => ({
  type: types.ADD_ERROR,
  data: content
});

export const dismissErrors = () => ({
  type: types.DISMISS_ERROR,
});
