import React from 'react';
import {DemoScreen} from './DemoScreen';
import {TabNavigator} from 'react-navigation';
import {SettingsScreen} from './screens/settings/SettingsScreen';
import {Ionicons} from '@expo/vector-icons';

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
  DemoScreen: {
    screen: DemoScreen
  },
  Settings: {
    screen: SettingsScreen
  }
});
