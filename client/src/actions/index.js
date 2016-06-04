import * as types from './types';

export const selectTransaction = (id) => {
  return {
    type: types.SELECT_TRANSACTION,
    id: id
  };
};
