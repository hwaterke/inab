import PropTypes from 'prop-types'
import React from 'react'

export class InputField extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    type: PropTypes.string,
    meta: PropTypes.shape({
      touched: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }).isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    type: 'text',
  }

  render() {
    const {
      input,
      meta: {touched, error},
      label,
      placeholder,
      ...rest
    } = this.props

    const classname = ['form-control']
    if (touched && error) {
      classname.push('is-invalid')
    }

    return (
      <div className="form-group">
        {label && <label>{label}</label>}
        <input
          {...input}
          {...rest}
          placeholder={placeholder || label}
          className={classname.join(' ')}
        />
        {touched && error && <div className="invalid-feedback">{error}</div>}
      </div>
    )
  }
}
