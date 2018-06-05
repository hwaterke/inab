import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {selectToken} from 'inab-shared'
import {LoginScreen} from './LoginScreen'
import {MainTabNavigator} from './MainTabNavigator'

const mapStateToProps = state => ({
  token: selectToken(state),
})

@connect(mapStateToProps)
export class LoginDispatcher extends React.Component {
  static propTypes = {
    token: PropTypes.string,
  }

  render() {
    if (this.props.token) {
      return <MainTabNavigator />
    }
    return <LoginScreen />
  }
}
