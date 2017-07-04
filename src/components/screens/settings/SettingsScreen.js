import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SettingsLogin} from './SettingsLogin';
import {colors} from '../../../constants/colors';
import {Banner} from '../../Banner';

export class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Banner />
        <SettingsLogin />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  }
});
