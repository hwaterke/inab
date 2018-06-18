import PropTypes from 'prop-types'
import {path} from 'ramda'
import React from 'react'
import Select from 'react-select'
import styled from 'styled-components'
import {Label} from '../../presentational/atoms/Label'

const Error = styled.div`
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
`

export const SelectField = ({
  disabled,
  options,
  label,
  input,
  meta: {touched, error},
  ...rest
}) => (
  <div className="field">
    {label && <Label>{label}</Label>}
    <Select
      isDisabled={disabled}
      options={options}
      value={options.find(i => i.value === input.value) || null}
      onChange={item => input.onChange(path(['value'], item) || null)}
      {...rest}
    />
    {touched && error && <Error>{error}</Error>}
  </div>
)

SelectField.propTypes = {
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  input: PropTypes.shape({
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
  label: PropTypes.string,
}
