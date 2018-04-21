// @flow
import moment from 'moment'

const PREV_MONTH = 'PREV_MONTH'
const NEXT_MONTH = 'NEXT_MONTH'
const SET_MONTH = 'SET_MONTH'

export const selectPreviousMonth = () => ({type: PREV_MONTH})
export const selectNextMonth = () => ({type: NEXT_MONTH})
export const selectMonth = (year: number, month: number) => ({
  type: SET_MONTH,
  year,
  month,
})

// Note: Months are zero indexed, so January is month 0

const now = moment()
const default_state = {
  year: now.year(),
  month: now.month(),
}

type State = {
  month: number,
  year: number,
}

export const selectedMonthReducer = (
  state: State = default_state,
  action: any
) => {
  switch (action.type) {
    case PREV_MONTH: {
      if (state.month === 0) {
        return {year: state.year - 1, month: 11}
      }
      return {year: state.year, month: state.month - 1}
    }
    case NEXT_MONTH: {
      if (state.month === 11) {
        return {year: state.year + 1, month: 0}
      }
      return {year: state.year, month: state.month + 1}
    }
    case SET_MONTH: {
      return {year: action.year, month: action.month}
    }
  }
  return state
}
