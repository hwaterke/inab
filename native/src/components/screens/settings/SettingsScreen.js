import React from 'react'
import {colors} from '../../../constants/colors'
import {SettingsLogin} from './SettingsLogin'
import {SettingsResources} from './SettingsResources'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Screen = styled.ScrollView`
  flex: 1;
  background-color: ${colors.background};
`

export class SettingsScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  }

  render() {
    return (
      <Screen>
        <SettingsLogin navigation={this.props.navigation} />
        <SettingsResources />
      </Screen>
    )
  }
}
