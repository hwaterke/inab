import React from 'react';
import PropTypes from 'prop-types';
import {SimpleSelect} from 'react-selectize';
import './SimpleSelect.scss';

export const SimpleSelectField = ({placeholder, disabled, options, input}) =>
  <SimpleSelect
    placeholder={placeholder}
    disabled={disabled}
    options={options}
    value={options.find(i => i.value === input.value)}
    onValueChange={item => input.onChange(item ? item.value : null)}
  />;

SimpleSelectField.propTypes = {
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired
    })
  ).isRequired,
  input: PropTypes.shape({
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired
  }).isRequired
};
