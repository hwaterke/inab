import React from 'react'
import {Link, Route} from 'react-router-dom'
import styled from 'styled-components'
import bg from '../../../images/land_slim.jpg'
import ErrorList from '../../ErrorList'
import {LoginDispatcher} from '../../LoginDispatcher'
import {Box} from '../../presentational/atoms/Box'
import {LoginForm} from './LoginForm'
import {RegistrationForm} from './RegistrationForm'

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  background-image: url(${bg});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-color: #cccccc;
`

export class LoginPage extends React.Component {
  render() {
    return (
      <LoginDispatcher away>
        <Page>
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-half">
                <Box>
                  <ErrorList />

                  <Route exact path="/login" component={LoginForm} />
                  <Route exact path="/register" component={RegistrationForm} />

                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <p>
                        No account? <Link to="/register">Register here</Link>
                      </p>
                    )}
                  />

                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <p>
                        Already have an account?{' '}
                        <Link to="/login">Login here</Link>
                      </p>
                    )}
                  />
                </Box>
              </div>
            </div>
          </div>
        </Page>
      </LoginDispatcher>
    )
  }
}
