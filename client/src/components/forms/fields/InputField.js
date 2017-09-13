import React from 'react';
import PropTypes from 'prop-types';

export class InputField extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    meta: PropTypes.shape({
      touched: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    required: PropTypes.bool,
    label: PropTypes.string
  };

  render() {
    const {label, input, type, required, meta: {touched, error}} = this.props;
    const classname = ['form-control'];
    if (touched && error) {
      classname.push('is-invalid');
    }

    return (
      <div className="form-group">
        {label &&
          <label>
            {label}
          </label>}
        <input
          {...input}
          placeholder={label}
          required={required}
          className={classname.join(' ')}
          type={type}
        />
        {touched &&
          error &&
          <div className="invalid-feedback">
            {error}
          </div>}
      </div>
    );
  }
}
