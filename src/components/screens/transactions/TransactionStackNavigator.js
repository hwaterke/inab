import {StackNavigator} from 'react-navigation';
import {TransactionListScreen} from './TransactionListScreen';
import {TransactionAccountListScreen} from './TransactionAccountListScreen';
import {globalStyles} from '../../../constants/styles';

TransactionAccountListScreen.navigationOptions = {
  title: 'Accounts',
  headerStyle: globalStyles.header
};

TransactionListScreen.navigationOptions = ({navigation}) => ({
  title: navigation.state.params.headerTitle || 'Transactions',
  headerStyle: globalStyles.header
});

export const TransactionStackNavigator = StackNavigator({
  AccountList: {
    screen: TransactionAccountListScreen
  },
  TransactionList: {
    screen: TransactionListScreen
  }
});
