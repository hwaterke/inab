import { createSelector } from 'reselect';
import moment from 'moment';

export const groupBy = (items, ...mappers) => {
  const mapper = mappers.shift();
  const result = new Map();
  items.forEach((i) => {
    result.set(mapper(i), result.get(mapper(i)) || []);
    result.get(mapper(i)).push(i);
  });
  if (mappers.length > 0) {
    result.forEach((v,k) => result.set(k, groupBy(v, ...mappers)));
  }
  return result;
};

export const groupByKey = (items, propName) => groupBy(items, (i) => i[propName]);

const mapByKey = (items, propName) => {
  const result = new Map();
  items.forEach((i) => result.set(i[propName], i));
  return result;
};

export const sumOf = (items, propName) =>
  items.reduce(function (a, b) {
    return b[propName] == null ? a : a + b[propName];
  }, 0);

export const beginningOfMonth = (dateString) => moment(dateString).startOf('month').format("YYYY-MM-DD");

export const createGroupingSelector = (itemSelector, propName) => createSelector(itemSelector, (items) => groupByKey(items, propName));

export const createMappingSelector = (itemSelector, propName) => createSelector(itemSelector, (items) => mapByKey(items, propName));
