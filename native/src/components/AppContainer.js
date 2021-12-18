import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {AuthStack} from './AuthStackNavigator'
import {AuthLoadingScreen} from '../AuthLoadingScreen'
import {MainTabNavigator} from './MainTabNavigator'

export const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: MainTabNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
)
