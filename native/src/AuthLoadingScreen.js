import React from 'react'
import {selectToken} from '@inab/shared'
import {connect} from 'react-redux'
import {ActivityIndicator, View} from 'react-native'
import PropTypes from 'prop-types'

class _AuthLoadingScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    token: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    this.props.navigation.navigate(this.props.token ? 'App' : 'Auth')
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  token: selectToken(state),
})

export const AuthLoadingScreen = connect(mapStateToProps)(_AuthLoadingScreen)
