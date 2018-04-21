import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export class ReportScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>ReportScreen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
