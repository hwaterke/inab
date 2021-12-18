import {createStackNavigator} from 'react-navigation'
import {MainTabNavigator} from './MainTabNavigator'

export const AppStack = createStackNavigator({
  Home: MainTabNavigator,
})
