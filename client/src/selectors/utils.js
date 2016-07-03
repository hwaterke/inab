export const groupBy = (items, propName) => {
  const result = new Map();
  items.forEach((i) => {
    result.set(i[propName], result.get(i[propName]) || []);
    result.get(i[propName]).push(i);
  });
  return result;
};

export const mapWith = (items, propName) => {
  const result = new Map();
  items.forEach((i) => result.set(i[propName], i));
  return result;
};

export const sumOf = (items, propName) =>
  items.reduce(function (a, b) {
    return b[propName] == null ? a : a + b[propName];
  }, 0);
