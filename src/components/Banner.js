import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {colors} from '../constants/colors';

export const Banner = () => <View style={styles.status} />;

const styles = StyleSheet.create({
  status: {
    height: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: colors.banner
  }
});
