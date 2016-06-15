export const groupBy = (items, propName) => {
  const result = {};
  items.forEach(function (i) {
    result[i[propName]] = result[i[propName]] || [];
    result[i[propName]].push(i);
  });
  return result;
};

export const sumOf = (items, propName) =>
  items.reduce(function (a, b) {
    return b[propName] == null ? a : a + b[propName];
  }, 0);
