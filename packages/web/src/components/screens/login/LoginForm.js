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

const mapStateToProps = (state) => ({
  initialValues: {
    backend: selectBackend(state),
    email: selectEmail(state),
  },
})

const mapDispatchToProps = {
  addError,
  setCredentials,
}

export const LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class LoginForm extends React.Component {
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
        .post(`${backend}/auth/login`, {
          email,
          password,
        })
        .then((response) => {
          if (response.headers.authorization) {
            const token = response.headers.authorization
            const {is_admin} = response.data
            this.props.setCredentials({backend, email, is_admin, token})
          } else {
            this.props.addError('Authentication failed.')
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            this.props.addError(error.response.data.message)
          } else {
            this.props.addError('Authentication failed.')
          }
        })
    }

    render() {
      return (
        <Form
          onSubmit={this.onSubmit}
          initialValues={this.props.initialValues}
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
                autoComplete="current-password"
                required
                validate={requiredField}
              />

              <Button type="submit" color="info">
                Login
              </Button>
            </form>
          )}
        />
      )
    }
  }
)
