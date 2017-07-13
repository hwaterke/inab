import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {amountFromCents} from 'inab-shared';
import {colors} from '../../../constants/colors';

export class TransactionRow extends React.Component {
  static propTypes = {
    transaction: PropTypes.object.isRequired
  };

  render() {
    const {transaction} = this.props;
    return (
      <View style={styles.row}>
        <View style={styles.innerLeft}>
          {transaction.isTransfer
            ? <View style={styles.withIcon}>
                <FontAwesome name="exchange" size={14} style={styles.icon} />
                <Text>
                  {transaction.transferAccountName}
                </Text>
              </View>
            : <Text>
                {transaction.payee}
              </Text>}

          {transaction.categoryName &&
            <Text style={styles.smallText}>
              {transaction.categoryName}
            </Text>}
        </View>

        <View style={styles.innerRight}>
          <Text style={transaction.amount < 0 ? styles.red : styles.green}>
            {amountFromCents(transaction.amount).toLocaleString(undefined, {
              style: 'currency',
              currency: 'EUR'
            })}
          </Text>

          <Text style={styles.smallText}>
            {transaction.accountName}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: StyleSheet.hairlineWidth
  },

  innerLeft: {
    justifyContent: 'space-between'
  },

  innerRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },

  withIcon: {flexDirection: 'row', alignItems: 'center'},

  icon: {
    color: colors.lightText,
    marginRight: 8
  },

  smallText: {
    color: colors.lightText,
    fontSize: 10
  },

  green: {
    color: colors.green
  },

  red: {
    color: colors.red
  }
});
