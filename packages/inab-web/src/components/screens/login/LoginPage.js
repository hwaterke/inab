import React from 'react'
import {Link, Route} from 'react-router-dom'
import styled from 'styled-components'
import {colors} from '../../../constants/colors'
import bg from '../../../images/land_slim.jpg'
import ErrorList from '../../ErrorList'
import {LoginDispatcher} from '../../LoginDispatcher'
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

const Container = styled.div`
  margin: 1rem;
  padding: 3rem;
  background-color: ${colors.frontBackground};
  border: 1px solid ${colors.border};
  border-radius: 6px;
`

export class LoginPage extends React.Component {
  render() {
    return (
      <LoginDispatcher away>
        <Page>
          <div className="container">
            <div className="row">
              <div className="col-md-6" />

              <div className="col-md-6">
                <Container>
                  <ErrorList />

                  <Route exact path="/login" component={LoginForm} />
                  <Route exact path="/register" component={RegistrationForm} />

                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <p className="text-secondary mt-3">
                        No account? <Link to="/register">Register here</Link>
                      </p>
                    )}
                  />

                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <p className="text-secondary mt-3">
                        Already have an account?{' '}
                        <Link to="/login">Login here</Link>
                      </p>
                    )}
                  />
                </Container>
              </div>
            </div>
          </div>
        </Page>
      </LoginDispatcher>
    )
  }
}
