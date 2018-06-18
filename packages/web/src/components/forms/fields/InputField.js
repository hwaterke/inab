import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import {Label} from '../../presentational/atoms/Label'

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

    return (
      <div className="field">
        {label && <Label>{label}</Label>}

        <div className="control">
          <input
            {...input}
            {...rest}
            placeholder={placeholder || label}
            className={classNames('input', {'is-danger': touched && error})}
          />

          {touched && error && <p className="help is-danger">{error}</p>}
        </div>
      </div>
    )
  }
}
