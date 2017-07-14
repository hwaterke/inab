import {StackNavigator} from 'react-navigation';
import {TransactionListScreen} from './TransactionListScreen';
import {TransactionAccountListScreen} from './TransactionAccountListScreen';
import {globalStyles} from '../../../constants/styles';
import {colors} from '../../../constants/colors';

TransactionAccountListScreen.navigationOptions = {
  title: 'Accounts',
  headerStyle: globalStyles.header,
  headerTitleStyle: globalStyles.headerTitle,
  headerTintColor: colors.bannerText
};

TransactionListScreen.navigationOptions = ({navigation}) => ({
  title: navigation.state.params.headerTitle || 'Transactions',
  headerStyle: globalStyles.header,
  headerTitleStyle: globalStyles.headerTitle,
  headerTintColor: colors.bannerText
});

export const TransactionStackNavigator = StackNavigator({
  AccountList: {
    screen: TransactionAccountListScreen
  },
  TransactionList: {
    screen: TransactionListScreen
  }
});
