export const groupBy = (items, propName) => {
  const result = {};
  items.forEach(function (i) {
    result[i[propName]] = result[i[propName]] || [];
    result[i[propName]].push(i);
  });
  return result;
};
