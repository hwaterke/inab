import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../constants/colors';
import {amountFromCents} from 'inab-shared';
import {globalStyles} from '../constants/styles';

export class Amount extends React.Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
    color: PropTypes.bool.isRequired
  };

  static defaultProps = {
    value: 0,
    color: false
  };

  viewStyle = () => {
    if (this.props.color) {
      if (this.props.value < 0) {
        return styles.negativeContainer;
      }
      if (this.props.value > 0) {
        return styles.positiveContainer;
      }
      return styles.zeroContainer;
    }
    return null;
  };

  textStyle = () => {
    if (this.props.color) {
      return styles.text;
    }

    if (this.props.value === 0) {
      return styles.zeroText;
    }

    return globalStyles.text;
  };

  render() {
    return (
      <View style={this.viewStyle()}>
        <Text style={this.textStyle()}>
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

  zeroContainer: {
    ...sharedStyle,
    backgroundColor: '#cfd5d8'
  },

  text: {
    color: '#ffffff',
    fontWeight: 'bold'
  },

  zeroText: {
    color: '#cfd5d8'
  }
});
