import {createSelector} from 'reselect';
import moment from 'moment';
import {getPreviousMonthMoment, getSelectedMonthMoment, getNextMonthMoment} from 'inab-shared';

export const getSelectedAccount = state => state.selectedAccount;

// Creates a selector that filters a list of items for a selected month
const createInMonthSelector = (itemSelector, itemMonthMapper, monthSelector) =>
  createSelector(itemSelector, monthSelector, (items, month) =>
    items.filter(i => moment(itemMonthMapper(i)).isSame(month))
  );

// Creates a selector that filters a list of items up to a selected month
const createUpToMonthSelector = (itemSelector, itemMonthMapper, monthSelector) =>
  createSelector(itemSelector, monthSelector, (items, month) =>
    items.filter(i => moment(itemMonthMapper(i)).isSameOrBefore(month))
  );

export const createInMonthSelectors = (itemSelector, itemMonthMapper) => ({
  previous: createInMonthSelector(itemSelector, itemMonthMapper, getPreviousMonthMoment),
  current: createInMonthSelector(itemSelector, itemMonthMapper, getSelectedMonthMoment),
  next: createInMonthSelector(itemSelector, itemMonthMapper, getNextMonthMoment)
});

export const createUpToMonthSelectors = (itemSelector, itemMonthMapper) => ({
  previous: createUpToMonthSelector(itemSelector, itemMonthMapper, getPreviousMonthMoment),
  current: createUpToMonthSelector(itemSelector, itemMonthMapper, getSelectedMonthMoment),
  next: createUpToMonthSelector(itemSelector, itemMonthMapper, getNextMonthMoment)
});
