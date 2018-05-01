import React from 'react'
import styled from 'styled-components'
import {colors} from '../../../constants/colors'
import bg from '../../../images/land_slim.jpg'
import ErrorList from '../../ErrorList'
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
  state = {
    showLogin: true,
  }

  toggle = () => {
    this.setState({showLogin: !this.state.showLogin})
  }

  render() {
    return (
      <Page>
        <div className="container">
          <div className="row">
            <div className="col-md-6" />

            <div className="col-md-6">
              <Container>
                <ErrorList />

                {this.state.showLogin ? <LoginForm /> : <RegistrationForm />}

                {this.state.showLogin ? (
                  <p className="text-secondary mt-3">
                    No account?
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={this.toggle}
                    >
                      Register here
                    </button>
                  </p>
                ) : (
                  <p className="text-secondary mt-3">
                    Already have an account?
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={this.toggle}
                    >
                      Login here
                    </button>
                  </p>
                )}
              </Container>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}
