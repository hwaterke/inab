import {createSelector} from 'reselect'
import moment from 'moment'

const getSelectedMonth = state => state.selectedMonth

export const getSelectedMonthMoment = createSelector(
  getSelectedMonth,
  selectedMonth => moment([selectedMonth.year, selectedMonth.month, 1])
)

export const getPreviousMonthMoment = createSelector(
  getSelectedMonthMoment,
  selectedMonth => selectedMonth.clone().subtract(1, 'months')
)

export const getNextMonthMoment = createSelector(
  getSelectedMonthMoment,
  selectedMonth => selectedMonth.clone().add(1, 'months')
)
