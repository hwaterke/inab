import React from 'react'
import {createBottomTabNavigator} from 'react-navigation'
import {Ionicons} from '@expo/vector-icons'
import {TransactionStackNavigator} from './screens/transactions/TransactionStackNavigator'
import {BudgetScreen} from './screens/budget/BudgetScreen'
import {ReportScreen} from './screens/reports/ReportScreen'
// import {TransactionAddScreen} from './screens/transactions/TransactionAddScreen'
import {SettingsNavigator} from './screens/settings/SettingsNavigator'
import {TransactionAddScreen} from './screens/transactions/TransactionAddScreen'

BudgetScreen.navigationOptions = {
  tabBarLabel: 'Budget',
  // eslint-disable-next-line react/prop-types,react/display-name
  tabBarIcon: ({tintColor}) => (
    <Ionicons name="ios-stats" size={26} style={{color: tintColor}} />
  ),
}

TransactionStackNavigator.navigationOptions = {
  tabBarLabel: 'Accounts',
  // eslint-disable-next-line react/prop-types,react/display-name
  tabBarIcon: ({tintColor}) => (
    <Ionicons name="ios-list" size={26} style={{color: tintColor}} />
  ),
}
/*
TransactionAddScreen.navigationOptions = {
  tabBarLabel: 'Add',
  // eslint-disable-next-line react/prop-types,react/display-name
  tabBarIcon: ({tintColor, focused}) => (
    <Ionicons
      name={focused ? 'ios-add' : 'ios-add-outline'}
      size={26}
      style={{color: tintColor}}
    />
  ),
}
*/
ReportScreen.navigationOptions = {
  tabBarLabel: 'Report',
  // eslint-disable-next-line react/prop-types,react/display-name
  tabBarIcon: ({tintColor}) => (
    <Ionicons name="ios-pie" size={26} style={{color: tintColor}} />
  ),
}

SettingsNavigator.navigationOptions = {
  tabBarLabel: 'Settings',
  // eslint-disable-next-line react/prop-types,react/display-name
  tabBarIcon: ({tintColor}) => (
    <Ionicons name="ios-settings" size={26} style={{color: tintColor}} />
  ),
}

export const MainTabNavigator = createBottomTabNavigator(
  {
    Budget: {
      screen: BudgetScreen,
    },
    Transactions: {
      screen: TransactionStackNavigator,
    },
    AddTransaction: {
      screen: TransactionAddScreen,
    },
    Report: {
      screen: ReportScreen,
    },
    Settings: {
      screen: SettingsNavigator,
    },
  },
  {
    initialRouteName: 'AddTransaction',
  }
)
