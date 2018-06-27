import PropTypes from 'prop-types'
import React from 'react'
import {Field} from 'react-final-form'

export const FieldValue = ({name, children}) => (
  <Field name={name} subscription={{value: true}}>
    {({input: {value}}) => children(value)}
  </Field>
)

FieldValue.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
}
