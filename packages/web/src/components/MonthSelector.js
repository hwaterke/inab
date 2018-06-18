import {
  getSelectedMonthMoment,
  selectMonth,
  selectNextMonth,
  selectPreviousMonth,
} from '@inab/shared'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Button} from './presentational/atoms/Button'
import {ButtonIcon} from './presentational/atoms/ButtonIcon'

@connect(state => ({selectedMonth: getSelectedMonthMoment(state)}))
class MonthSelector extends React.Component {
  static propTypes = {
    selectedMonth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  previous = () => {
    this.props.dispatch(selectPreviousMonth())
  }

  current = () => {
    const now = moment()
    this.props.dispatch(selectMonth(now.year(), now.month()))
  }

  next = () => {
    this.props.dispatch(selectNextMonth())
  }

  render() {
    return (
      <div className="buttons has-addons">
        <ButtonIcon onClick={this.previous} icon="arrow-left" />

        <Button onClick={this.current}>
          {this.props.selectedMonth.format('MMMM-YYYY')}
        </Button>

        <ButtonIcon onClick={this.next} icon="arrow-right" />
      </div>
    )
  }
}

export default MonthSelector
