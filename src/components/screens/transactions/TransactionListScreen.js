import React from 'react';
import PropTypes from 'prop-types';
import {View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {TransactionResource} from 'inab-shared';
import {crud} from '../../hoc/crud';
import {globalStyles} from '../../../constants/styles';
import {getTransactionForRendering} from '../../../selectors/transactions';
import {TransactionRow} from './TransactionRow';

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
      <View style={globalStyles.screen}>
        <FlatList
          data={this.state.filteredTransactions}
          onRefresh={this.onRefresh}
          refreshing={this.state.isFetching}
          renderItem={({item}) => <TransactionRow transaction={item} />}
        />
      </View>
    );
  }
}
