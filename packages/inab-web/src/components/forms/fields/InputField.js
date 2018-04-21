import React from 'react'
import PropTypes from 'prop-types'

export class InputField extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    step: PropTypes.string,
    meta: PropTypes.shape({
      touched: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }).isRequired,
    required: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
  }

  render() {
    const {
      input,
      type,
      step,
      required,
      meta: {touched, error},
      label,
      placeholder,
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
          placeholder={placeholder || label}
          required={required}
          className={classname.join(' ')}
          type={type}
          step={step}
        />
        {touched && error && <div className="invalid-feedback">{error}</div>}
      </div>
    )
  }
}
