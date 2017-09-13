import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import axios from 'axios';
import {addError} from '../../../actions/error';
import {setCredentials} from '../../../reducers/credentials';
import {connect} from 'react-redux';
import {InputField} from '../../forms/fields/InputField';

const mapStateToProps = state => ({
  backend: state.credentials.backend
});

const mapDispatchToProps = {
  addError,
  setCredentials
};

const validate = data => {
  const errors = {};

  if (!data.email) {
    errors.email = 'Required';
  }

  if (!data.password) {
    errors.password = 'Required';
  }

  if (data.password !== data['confirm-password']) {
    errors['confirm-password'] = 'Does not match your password';
  }

  if (!data['confirm-password']) {
    errors['confirm-password'] = 'Required';
  }

  return errors;
};

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({form: 'register', enableReinitialize: true, validate})
export class RegistrationForm extends React.Component {
  static propTypes = {
    backend: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    setCredentials: PropTypes.func.isRequired,
    addError: PropTypes.func.isRequired
  };

  onSubmit = ({email, password}) => {
    axios
      .post(`${this.props.backend}/register`, {
        email,
        password
      })
      .then(response => {
        if (response.headers.authorization) {
          const token = response.headers.authorization;
          this.props.setCredentials({email, token});
        } else {
          this.props.addError('Registration failed.');
        }
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          this.props.addError(error.response.data.message);
        } else {
          this.props.addError('Registration failed.');
        }
      });
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Field name="email" component={InputField} type="email" label="Email" required />

        <Field name="password" component={InputField} type="password" label="Password" required />

        <Field
          name="confirm-password"
          component={InputField}
          type="password"
          label="Password confirmation"
          required
        />

        <button type="submit" className="btn btn-secondary">
          Register
        </button>
      </form>
    );
  }
}
