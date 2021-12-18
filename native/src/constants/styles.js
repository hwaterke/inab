import {StyleSheet} from 'react-native'
import {colors} from './colors'

export const globalStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  text: {
    color: colors.text,
  },

  lightText: {
    color: colors.lightText,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  header: {
    backgroundColor: colors.banner,
    // iOS
    borderBottomWidth: 0,
    // Android
    elevation: 0,
  },

  headerTitle: {
    color: colors.bannerText,
  },

  sectionView: {
    backgroundColor: colors.banner,
    paddingVertical: 2,
  },

  sectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 16,
  },
})
