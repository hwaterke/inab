import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {colors} from '../constants/colors'

export class DemoScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>DemoScreen</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.banner,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
