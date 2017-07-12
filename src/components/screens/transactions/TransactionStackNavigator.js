import {StackNavigator} from 'react-navigation';
import {TransactionListScreen} from './TransactionListScreen';
import {TransactionAccountListScreen} from './TransactionAccountListScreen';
import {globalStyles} from '../../../constants/styles';

TransactionAccountListScreen.navigationOptions = {
  title: 'Accounts',
  headerStyle: globalStyles.header
};

TransactionListScreen.navigationOptions = {
  title: 'Transactions',
  headerStyle: globalStyles.header
};

export const TransactionStackNavigator = StackNavigator({
  AccountList: {
    screen: TransactionAccountListScreen
  },
  TransactionList: {
    screen: TransactionListScreen
  }
});
