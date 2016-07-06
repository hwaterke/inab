import { createSelector } from 'reselect';
import moment from 'moment';

export const getSelectedPage = (state) => state.selectedPage.name;

export const getSelectedAccount = (state) => state.selectedPage.name == 'ACCOUNT' && state.selectedPage.data;

export const getSelectedTransactions = (state) => state.selectedTransactions;

export const getSelectedMonth = (state) => ({
  month: state.ui.get('budget').get('month'),
  year: state.ui.get('budget').get('year')
});

export const getCurrentMonth = createSelector(
  getSelectedMonth,
  selectedMonth => {
    return moment([selectedMonth.year, selectedMonth.month - 1, 1]);
  }
);

export const getPreviousMonth = createSelector(
  getCurrentMonth,
  selectedMonth => selectedMonth.subtract(1, 'months')
);

export const getNextMonth = createSelector(
  getCurrentMonth,
  selectedMonth => selectedMonth.add(1, 'months')
);

// Creates a selector that filters a list of items for a selected month
const createInMonthSelector = (itemSelector, itemMonthMapper, monthSelector) => createSelector(
  itemSelector,
  monthSelector,
  (items, month) => items.filter(i => moment(itemMonthMapper(i)).isSame(month))
);

// Creates a selector that filters a list of items up to a selected month
const createUpToMonthSelector = (itemSelector, itemMonthMapper, monthSelector) => createSelector(
  itemSelector,
  monthSelector,
  (items, month) => items.filter(i => moment(itemMonthMapper(i)).isSameOrBefore(month))
);

export const createInMonthSelectors = (itemSelector, itemMonthMapper) => ({
  previous: createInMonthSelector(itemSelector, itemMonthMapper, getPreviousMonth),
  current: createInMonthSelector(itemSelector, itemMonthMapper, getCurrentMonth),
  next: createInMonthSelector(itemSelector, itemMonthMapper, getNextMonth)
});

export const createUpToMonthSelectors = (itemSelector, itemMonthMapper) => ({
  previous: createUpToMonthSelector(itemSelector, itemMonthMapper, getPreviousMonth),
  current: createUpToMonthSelector(itemSelector, itemMonthMapper, getCurrentMonth),
  next: createUpToMonthSelector(itemSelector, itemMonthMapper, getNextMonth)
});
