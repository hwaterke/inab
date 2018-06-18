import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {Label} from '../../presentational/atoms/Label'

export const DatePickerField = ({input, label}) => (
  <div className="field">
    {label && <Label>{label}</Label>}
    <DatePicker
      dateFormat="DD/MM/YYYY"
      className="input"
      selected={moment(input.value)}
      onChange={param => input.onChange(param.format('YYYY-MM-DD'))}
    />
  </div>
)

DatePickerField.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.string,
}
