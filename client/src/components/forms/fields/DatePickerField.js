import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const DatePickerField = ({input}) => (
  <DatePicker
    dateFormat="DD/MM/YYYY"
    className="form-control"
    selected={moment(input.value)}
    onChange={param => input.onChange(param.format('YYYY-MM-DD'))}
  />
);

DatePickerField.propTypes = {
  input: React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  }).isRequired
};

export default DatePickerField;
