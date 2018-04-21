import React from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import {SettingsLogin} from './SettingsLogin';
import {colors} from '../../../constants/colors';
import {Banner} from '../../Banner';
import {SettingsResources} from './SettingsResources';

export class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Banner />
        <ScrollView>
          <SettingsLogin />
          <SettingsResources />
        </ScrollView>
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
