import React from 'react'
import PropTypes from 'prop-types'
import {FlatList, View} from 'react-native'
import {connect} from 'react-redux'
import {
  AccountResource,
  getBudgetBalance,
  selectBalanceByAccountId,
} from 'inab-shared'
import {ResourceListProvider, select} from 'redux-crud-provider'
import {globalStyles} from '../../../constants/styles'
import {uuidExtractor} from '../../../utils'
import {crudThunks} from '../../../thunks/crudThunks'
import {AccountRow} from './AccountRow'

const mapStateToProps = state => ({
  accounts: select(AccountResource).asArray(state),
  balanceByAccountId: selectBalanceByAccountId(state),
  budgetBalance: getBudgetBalance(state),
})

@connect(mapStateToProps)
export class TransactionAccountListScreen extends React.Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(AccountResource.propTypes).isRequired,
    budgetBalance: PropTypes.number.isRequired,
    balanceByAccountId: PropTypes.objectOf(PropTypes.number).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  }

  navigateToAccount = (accountUuid, accountName) => {
    this.props.navigation.navigate('TransactionList', {
      accountUuid,
      headerTitle: accountName,
    })
  }

  render() {
    return (
      <View style={globalStyles.screen}>
        <ResourceListProvider
          crudThunks={crudThunks}
          resource={AccountResource}
          replace
          autoFetch
        >
          {({fetchAll, loading}) => (
            <FlatList
              data={this.props.accounts}
              keyExtractor={uuidExtractor}
              onRefresh={fetchAll}
              refreshing={loading}
              renderItem={({item}) => (
                <AccountRow
                  name={item.name}
                  amount={this.props.balanceByAccountId[item.uuid]}
                  onPress={() => this.navigateToAccount(item.uuid, item.name)}
                />
              )}
              ListHeaderComponent={() => (
                <AccountRow
                  name="All"
                  amount={this.props.budgetBalance}
                  onPress={() => this.navigateToAccount()}
                />
              )}
            />
          )}
        </ResourceListProvider>
      </View>
    )
  }
}
