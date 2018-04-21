import React from 'react'
import './LoginPage.scss'
import {LoginForm} from './LoginForm'
import {RegistrationForm} from './RegistrationForm'
import ErrorList from '../../ErrorList'

export class LoginPage extends React.Component {
  state = {
    showLogin: true,
  }

  toggle = () => {
    this.setState({showLogin: !this.state.showLogin})
  }

  render() {
    return (
      <div className="login-full-page">
        <div className="container">
          <div className="row">
            <div className="col-md-6" />

            <div className="col-md-6">
              <div className="login-container">
                <ErrorList />

                {this.state.showLogin ? <LoginForm /> : <RegistrationForm />}

                {this.state.showLogin ? (
                  <p className="text-secondary mt-3">
                    No account?{' '}
                    <a href="#" onClick={this.toggle}>
                      Register here
                    </a>
                  </p>
                ) : (
                  <p className="text-secondary mt-3">
                    Already have an account?{' '}
                    <a href="#" onClick={this.toggle}>
                      Login here
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
