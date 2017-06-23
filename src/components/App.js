import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>INAB</Text>
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
