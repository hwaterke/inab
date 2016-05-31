// TODO ID should be determined by the server.
let nextTodoId = 0;

export const addTransaction = (date, payee, category, description, amount) => {
  return {
    type: 'ADD_TRANSACTION',
    id: nextTodoId++,
    date,
    payee,
    category,
    description,
    amount
  };
};
