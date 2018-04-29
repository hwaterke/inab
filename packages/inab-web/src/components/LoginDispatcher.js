import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {LoginPage} from './screens/login/LoginPage'

@connect(state => ({token: state.credentials.token}))
export class LoginDispatcher extends React.Component {
  static propTypes = {
    token: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    if (this.props.token) {
      return <div>{this.props.children}</div>
    }

    return <LoginPage />
  }
}
