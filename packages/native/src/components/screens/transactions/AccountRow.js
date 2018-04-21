import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {globalStyles} from '../../../constants/styles';
import {Amount} from '../../Amount';

export class AccountRow extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    amount: PropTypes.number,
    onPress: PropTypes.func.isRequired
  };

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={globalStyles.row}>
          <Text>
            {this.props.name}
          </Text>
          <View style={styles.end}>
            <Amount color value={this.props.amount} />
            <Ionicons name="ios-arrow-forward" size={26} style={styles.icon} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  end: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },

  icon: {
    marginLeft: 16,
    opacity: 0.5
  }
});
