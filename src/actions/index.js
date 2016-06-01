// Contains the action creators.
import * as types from './types';

// TODO ID should be determined by the server.
let nextTodoId = 0;

export const addTransaction = (date, payee, category, description, amount) => {
  return {
    type: types.ADD_TRANSACTION,
    id: nextTodoId++,
    date,
    payee,
    category,
    description,
    amount
  };
};

export const addRandomTransaction = () => {
  const names = ['Alice', 'Bob', 'Eve'];
  var payee = names[Math.floor(Math.random() * names.length)];
  const amount = Math.round(Math.random() * 500);
  return addTransaction("12/12/2016", payee, "Category", "Description", amount);
};

export const selectTransaction = (id) => {
  return {
    type: types.SELECT_TRANSACTION,
    id: id
  };
};
