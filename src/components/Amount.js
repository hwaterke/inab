import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../constants/colors';
import {amountFromCents} from 'inab-shared';

export class Amount extends React.Component {
  static propTypes = {
    value: PropTypes.number.isRequired
  };

  static defaultProps = {
    value: 0
  };

  render() {
    return (
      <View
        style={
          this.props.value < 0
            ? styles.negativeContainer
            : styles.positiveContainer
        }
      >
        <Text style={styles.text}>
          {amountFromCents(this.props.value).toLocaleString(undefined, {
            style: 'currency',
            currency: 'EUR'
          })}
        </Text>
      </View>
    );
  }
}

const sharedStyle = {
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 10
};

const styles = StyleSheet.create({
  positiveContainer: {
    ...sharedStyle,
    backgroundColor: colors.green
  },

  negativeContainer: {
    ...sharedStyle,
    backgroundColor: '#ffa48f'
  },

  text: {
    color: '#ffffff',
    fontWeight: 'bold'
  }
});
