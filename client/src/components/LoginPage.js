// @flow
import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import axios from 'axios';
import {setCredentials} from '../reducers/credentials';
import {addError} from '../actions/error';

const mapStateToProps = (state) => ({
  backend: state.credentials.backend,
  initialValues: {
    email: state.credentials.email
  }
});

// TODO implement validation for the form
@connect(mapStateToProps)
@reduxForm({form: 'login', enableReinitialize: true})
export class LoginPage extends React.Component {

  static propTypes = {
    backend: React.PropTypes.string.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  onSubmit = ({email, password}) => {
    axios.post(`${this.props.backend}/login`, {
      email,
      password
    }).then(response => {
      if (response.headers.authorization) {
        const token = response.headers.authorization;
        this.props.dispatch(setCredentials({email, token}));
      } else {
        this.props.dispatch(addError('Authentication failed.'));
      }

    }).catch(error => {
      this.props.dispatch(addError(error));
    });
  };

  render() {
    return (
      <div className="box-container">
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>

          <div className="form-group">
            <label>Email</label>
            <Field
              name="email"
              component="input"
              type="email"
              className="form-control"
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <Field
              name="password"
              component="input"
              type="password"
              className="form-control"
              placeholder="Password"
            />
          </div>

          <button type="submit" className="btn btn-secondary">
            Login
          </button>

        </form>
      </div>
    );
  }
}
