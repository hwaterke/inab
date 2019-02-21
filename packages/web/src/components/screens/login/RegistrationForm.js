import {selectBackend, selectEmail, setCredentials} from '@inab/shared'
import axios from 'axios'
import PropTypes from 'prop-types'
import React from 'react'
import {Field, Form} from 'react-final-form'
import {connect} from 'react-redux'
import {addError} from '../../../actions/error'
import {requiredField} from '../../../utils/fieldValidation'
import {InputField} from '../../forms/fields/InputField'
import {Button} from '../../presentational/atoms/Button'

const mapStateToProps = state => ({
  initialValues: {
    backend: selectBackend(state),
    email: selectEmail(state),
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

export const RegistrationForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class RegistrationForm extends React.Component {
    static propTypes = {
      setCredentials: PropTypes.func.isRequired,
      addError: PropTypes.func.isRequired,
      initialValues: PropTypes.shape({
        backend: PropTypes.string,
        email: PropTypes.string,
      }).isRequired,
    }

    onSubmit = ({backend, email, password}) => {
      axios
        .post(`${backend}/auth/register`, {
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
        <Form
          onSubmit={this.onSubmit}
          initialValues={this.props.initialValues}
          validate={validate}
          render={({handleSubmit}) => (
            <form onSubmit={handleSubmit}>
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

              <Button type="submit" color="info">
                Register
              </Button>
            </form>
          )}
        />
      )
    }
  }
)
