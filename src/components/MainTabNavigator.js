import React from 'react';
import {TabNavigator} from 'react-navigation';
import {SettingsScreen} from './screens/settings/SettingsScreen';
import {Ionicons} from '@expo/vector-icons';
import {TransactionStackNavigator} from './screens/transactions/TransactionStackNavigator';
import {BudgetScreen} from './screens/budget/BudgetScreen';

BudgetScreen.navigationOptions = {
  tabBarLabel: 'Budget',
  // eslint-disable-next-line react/prop-types,react/display-name
  tabBarIcon: ({tintColor, focused}) =>
    <Ionicons
      name={focused ? 'ios-stats' : 'ios-stats-outline'}
      size={26}
      style={{color: tintColor}}
    />
};

TransactionStackNavigator.navigationOptions = {
  tabBarLabel: 'Accounts',
  // eslint-disable-next-line react/prop-types,react/display-name
  tabBarIcon: ({tintColor, focused}) =>
    <Ionicons
      name={focused ? 'ios-list' : 'ios-list-outline'}
      size={26}
      style={{color: tintColor}}
    />
};

SettingsScreen.navigationOptions = {
  tabBarLabel: 'Settings',
  // eslint-disable-next-line react/prop-types,react/display-name
  tabBarIcon: ({tintColor, focused}) =>
    <Ionicons
      name={focused ? 'ios-settings' : 'ios-settings-outline'}
      size={26}
      style={{color: tintColor}}
    />
};

export const MainTabNavigator = TabNavigator({
  Budget: {
    screen: BudgetScreen
  },
  Transactions: {
    screen: TransactionStackNavigator
  },
  Settings: {
    screen: SettingsScreen
  }
});
