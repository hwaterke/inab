import axios from 'axios'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form'
import {addError} from '../../../actions/error'
import {setCredentials} from '../../../reducers/credentials'
import {requiredField} from '../../../utils/fieldValidation'
import {InputField} from '../../forms/fields/InputField'

const mapStateToProps = state => ({
  initialValues: {
    backend: state.credentials.backend,
    email: state.credentials.email,
  },
})

const mapDispatchToProps = {
  addError,
  setCredentials,
}

const validate = data => {
  const errors = {}

  if (data.password !== data['confirm-password']) {
    errors['confirm-password'] = 'Does not match your password'
  }

  return errors
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({form: 'register', enableReinitialize: true, validate})
export class RegistrationForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    setCredentials: PropTypes.func.isRequired,
    addError: PropTypes.func.isRequired,
  }

  onSubmit = ({backend, email, password}) => {
    axios
      .post(`${backend}/register`, {
        email,
        password,
      })
      .then(response => {
        if (response.headers.authorization) {
          const token = response.headers.authorization
          const {is_admin} = response.data
          this.props.setCredentials({backend, email, is_admin, token})
        } else {
          this.props.addError('Registration failed.')
        }
      })
      .catch(error => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          this.props.addError(error.response.data.message)
        } else {
          this.props.addError('Registration failed.')
        }
      })
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Field
          name="backend"
          component={InputField}
          type="text"
          label="Backend"
          required
          validate={requiredField}
        />

        <Field
          name="email"
          component={InputField}
          type="email"
          label="Email"
          autoComplete="email"
          required
          validate={requiredField}
        />

        <Field
          name="password"
          component={InputField}
          type="password"
          label="Password"
          autoComplete="new-password"
          required
          validate={requiredField}
        />

        <Field
          name="confirm-password"
          component={InputField}
          type="password"
          label="Password confirmation"
          autoComplete="new-password"
          required
          validate={requiredField}
        />

        <button type="submit" className="btn btn-secondary">
          Register
        </button>
      </form>
    )
  }
}
