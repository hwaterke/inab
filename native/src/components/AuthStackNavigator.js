import {createStackNavigator} from 'react-navigation'
import {LoginScreen} from './LoginScreen'

export const AuthStack = createStackNavigator({
  Login: LoginScreen,
}, {
  headerMode: 'none'
})
