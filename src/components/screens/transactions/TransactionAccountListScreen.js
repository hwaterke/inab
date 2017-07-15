import React from 'react';
import PropTypes from 'prop-types';
import {View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {arraySelector} from 'hw-react-shared';
import {
  AccountResource,
  selectBalanceByAccountId,
  getBudgetBalance
} from 'inab-shared';
import {crud} from '../../hoc/crud';
import {globalStyles} from '../../../constants/styles';
import {uuidExtractor} from '../../../utils';
import {AccountRow} from './AccountRow';

const mapStateToProps = state => ({
  accounts: arraySelector(AccountResource)(state),
  balanceByAccountId: selectBalanceByAccountId(state),
  budgetBalance: getBudgetBalance(state)
});

@crud
@connect(mapStateToProps)
export class TransactionAccountListScreen extends React.Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(AccountResource.propType).isRequired,
    fetchAll: PropTypes.func.isRequired,
    budgetBalance: PropTypes.number.isRequired,
    balanceByAccountId: PropTypes.objectOf(PropTypes.number).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired
    }).isRequired
  };

  state = {
    isFetching: false
  };

  onRefresh = () => {
    this.setState({isFetching: true}, () => {
      this.props
        .fetchAll(AccountResource, true)
        .then(() => this.setState({isFetching: false}))
        .catch(() => this.setState({isFetching: false}));
    });
  };

  navigateToAccount = (accountUuid, accountName) => {
    this.props.navigation.navigate('TransactionList', {
      accountUuid,
      headerTitle: accountName
    });
  };

  render() {
    return (
      <View style={globalStyles.screen}>
        <FlatList
          data={this.props.accounts}
          keyExtractor={uuidExtractor}
          onRefresh={this.onRefresh}
          refreshing={this.state.isFetching}
          renderItem={({item}) =>
            <AccountRow
              name={item.name}
              amount={this.props.balanceByAccountId[item.uuid]}
              onPress={() => this.navigateToAccount(item.uuid, item.name)}
            />}
          ListHeaderComponent={() =>
            <AccountRow
              name="All"
              amount={this.props.budgetBalance}
              onPress={() => this.navigateToAccount()}
            />}
        />
      </View>
    );
  }
}
