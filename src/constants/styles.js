import {StyleSheet} from 'react-native';
import {colors} from './colors';

export const globalStyles = StyleSheet.create({
  flex: {
    flex: 1
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background
  },

  text: {
    color: colors.text
  }
});
