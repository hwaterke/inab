import {SettingsScreen} from './SettingsScreen'
import {createStackNavigator} from 'react-navigation'
import {globalStyles} from '../../../constants/styles'
import {colors} from '../../../constants/colors'

export const SettingsNavigator = createStackNavigator(
  {
    SettingsScreen: {
      screen: SettingsScreen,
      navigationOptions: {title: 'Settings'},
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: globalStyles.header,
      headerTitleStyle: globalStyles.headerTitle,
      headerTintColor: colors.bannerText,
    },
  }
)
