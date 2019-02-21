import PropTypes from 'prop-types'
import React from 'react'
import {Field} from 'react-final-form'

export const FieldCondition = ({when, is, children}) => (
  <Field name={when} subscription={{value: true}}>
    {({input: {value}}) => (value === is ? children : null)}
  </Field>
)

FieldCondition.propTypes = {
  when: PropTypes.string.isRequired,
  is: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
}
