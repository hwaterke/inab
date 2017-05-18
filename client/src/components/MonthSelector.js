import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from './Button';
import ButtonIcon from './ButtonIcon';
import {connect} from 'react-redux';
import {selectPreviousMonth, selectMonth, selectNextMonth} from 'inab-shared/src/reducers/month';
import {getSelectedMonthMoment} from 'inab-shared/src/selectors/month';

@connect(state => ({selectedMonth: getSelectedMonthMoment(state)}))
class MonthSelector extends React.Component {
  static propTypes = {
    selectedMonth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.current = this.current.bind(this);
    this.next = this.next.bind(this);
  }

  previous = () => {
    this.props.dispatch(selectPreviousMonth());
  };

  current() {
    const now = moment();
    this.props.dispatch(selectMonth(now.year(), now.month()));
  }

  next = () => {
    this.props.dispatch(selectNextMonth());
  };

  render() {
    return (
      <div className="btn-group" role="group">
        <ButtonIcon onClick={this.previous} icon="arrow-left" />
        <Button onClick={this.current}>{this.props.selectedMonth.format('MMMM-YYYY')}</Button>
        <ButtonIcon onClick={this.next} icon="arrow-right" />
      </div>
    );
  }
}

export default MonthSelector;
