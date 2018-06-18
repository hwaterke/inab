import {selectToken} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

@connect(state => ({token: selectToken(state)}))
export class LoginDispatcher extends React.Component {
  static propTypes = {
    token: PropTypes.string,
    children: PropTypes.node,
    away: PropTypes.bool,
  }

  static defaultProps = {
    away: false,
  }

  render() {
    // If we need to redirect away (from login) and we have a token
    if (this.props.away && this.props.token) {
      return <Redirect to="/" />
    }

    // If we need to redirect to login and we do not have a token
    if (!this.props.away && !this.props.token) {
      return <Redirect to="/login" />
    }

    return this.props.children
  }
}
