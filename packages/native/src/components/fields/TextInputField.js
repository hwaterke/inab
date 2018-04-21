import React from 'react'
import PropTypes from 'prop-types'
import {TextInput} from 'react-native'

export class TextInputField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      value: PropTypes.string,
      onChange: PropTypes.func.isRequired,
    }).isRequired,
    meta: PropTypes.object,
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {
      input: {value, onChange},
      meta,
      ...rest
    } = this.props
    return (
      <TextInput
        value={value}
        onChangeText={value => onChange(value)}
        {...rest}
      />
    )
  }
}
