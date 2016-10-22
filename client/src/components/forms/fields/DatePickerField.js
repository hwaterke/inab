import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerField = ({input}) =>
  <DatePicker
    className="form-control"
    selected={input.value}
    onChange={param => input.onChange(param)} />;

DatePickerField.propTypes = {
  input: React.PropTypes.shape({
    value: React.PropTypes.any.isRequired,
    onChange: React.PropTypes.func.isRequired
  }).isRequired
};

export default DatePickerField;
