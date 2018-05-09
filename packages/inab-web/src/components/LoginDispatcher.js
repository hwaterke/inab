import {selectToken} from 'inab-shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {LoginPage} from './screens/login/LoginPage'

@connect(state => ({token: selectToken(state)}))
export class LoginDispatcher extends React.Component {
  static propTypes = {
    token: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    if (this.props.token) {
      return this.props.children
    }

    return <LoginPage />
  }
}
