import React from 'react';
import { SimpleSelect } from 'react-selectize';
import 'react-selectize/themes/index.css';

const SimpleSelectField = ({placeholder, disabled, options, input}) =>
  <SimpleSelect
    placeholder={placeholder}
    disabled={disabled}
    options={options}
    onValueChange={item => input.onChange(item && item.value)} />;

SimpleSelectField.propTypes = {
  placeholder: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  options: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired
  })).isRequired,
  input: React.PropTypes.shape({
    onChange: React.PropTypes.func.isRequired
  }).isRequired
};

export default SimpleSelectField;
