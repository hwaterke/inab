import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {TransactionResource, amountFromCents} from 'inab-shared';
import {crud} from '../../hoc/crud';
import {colors} from '../../../constants/colors';
import {uuidExtractor} from '../../../utils';
import {globalStyles} from '../../../constants/styles';
import {getTransactionForRendering} from '../../../selectors/transactions';

const mapStateToProps = state => ({
  transactions: getTransactionForRendering(state)
});

@crud
@connect(mapStateToProps)
export class TransactionListScreen extends React.Component {
  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionResource.propType).isRequired,
    fetchAll: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          accountUuid: PropTypes.string
        }).isRequired
      }).isRequired
    }).isRequired
  };

  state = {
    isFetching: false,
    filteredTransactions: []
  };

  onRefresh = () => {
    this.setState({isFetching: true}, () => {
      this.props
        .fetchAll(TransactionResource, true)
        .then(() => this.setState({isFetching: false}));
    });
  };

  filterTransactions = transactions => {
    const {accountUuid} = this.props.navigation.state.params;
    this.setState({
      filteredTransactions: transactions.filter(
        tr => !accountUuid || tr.account_uuid === accountUuid
      )
    });
  };

  componentDidMount() {
    this.filterTransactions(this.props.transactions);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.navigation.state.params !==
        nextProps.navigation.state.params ||
      this.props.transactions !== nextProps.transactions
    ) {
      this.filterTransactions(nextProps.transactions);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.filteredTransactions}
          keyExtractor={uuidExtractor}
          onRefresh={this.onRefresh}
          refreshing={this.state.isFetching}
          renderItem={({item}) =>
            <View style={globalStyles.row}>
              <View>
                <Text>
                  {item.payee}
                </Text>
                <Text style={styles.smallText}>
                  {item.categoryName}
                </Text>
              </View>
              <View style={styles.alignRight}>
                <Text style={item.amount < 0 ? styles.red : styles.green}>
                  {amountFromCents(item.amount)}
                </Text>
                <Text style={styles.smallText}>
                  {item.accountName}
                </Text>
              </View>
            </View>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  alignRight: {
    alignItems: 'flex-end'
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
