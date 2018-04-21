// @flow
import R from 'ramda'
import moment from 'moment'
import {createSelector} from 'reselect'
import {
  getPreviousMonthMoment,
  getSelectedMonthMoment,
  getNextMonthMoment,
} from './month'

type sumOfAmountsType = <T: {amount: number}>(items: T[]) => number
export const sumOfAmounts: sumOfAmountsType = R.reduce(
  (acc: number, record: {amount: number}) => acc + record.amount,
  0
)

export const beginningOfMonth = (dateString: string): string =>
  moment(dateString)
    .startOf('month')
    .format('YYYY-MM-DD')

// Creates a selector that filters a list of items for a selected month
const createInMonthSelector = (itemSelector, itemMonthMapper, monthSelector) =>
  createSelector(itemSelector, monthSelector, (items, month) =>
    items.filter(i => moment(itemMonthMapper(i)).isSame(month))
  )

// Creates a selector that filters a list of items up to a selected month
const createUpToMonthSelector = (
  itemSelector,
  itemMonthMapper,
  monthSelector
) =>
  createSelector(itemSelector, monthSelector, (items, month) =>
    items.filter(i => moment(itemMonthMapper(i)).isSameOrBefore(month))
  )

export const createInMonthSelectors = (
  itemSelector: any,
  itemMonthMapper: any
) => ({
  previous: createInMonthSelector(
    itemSelector,
    itemMonthMapper,
    getPreviousMonthMoment
  ),
  selected: createInMonthSelector(
    itemSelector,
    itemMonthMapper,
    getSelectedMonthMoment
  ),
  next: createInMonthSelector(
    itemSelector,
    itemMonthMapper,
    getNextMonthMoment
  ),
})

export const createUpToMonthSelectors = (
  itemSelector: any,
  itemMonthMapper: any
) => ({
  previous: createUpToMonthSelector(
    itemSelector,
    itemMonthMapper,
    getPreviousMonthMoment
  ),
  selected: createUpToMonthSelector(
    itemSelector,
    itemMonthMapper,
    getSelectedMonthMoment
  ),
  next: createUpToMonthSelector(
    itemSelector,
    itemMonthMapper,
    getNextMonthMoment
  ),
})
