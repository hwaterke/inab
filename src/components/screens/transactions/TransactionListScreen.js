import React from 'react';
import PropTypes from 'prop-types';
import {View, SectionList, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {TransactionResource} from 'inab-shared';
import moment from 'moment';
import R from 'ramda';
import {crud} from '../../hoc/crud';
import {globalStyles} from '../../../constants/styles';
import {getTransactionForRendering} from '../../../selectors/transactions';
import {TransactionRow} from './TransactionRow';
import {colors} from '../../../constants/colors';

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

    const sections = Object.entries(
      R.groupBy(
        tr => moment(tr.date, 'YYYY-MM-DD').format('D MMMM YYYY'),
        transactions.filter(
          tr => !accountUuid || tr.account_uuid === accountUuid
        )
      )
    ).map(en => ({title: en[0], data: en[1]}));

    this.setState({
      filteredTransactions: sections
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

  renderItem = ({item}) => <TransactionRow transaction={item} />;

  renderSectionHeader = ({section}) =>
    <View style={styles.sectionView}>
      <Text style={styles.sectionText}>
        {section.title}
      </Text>
    </View>;

  render() {
    return (
      <View style={globalStyles.screen}>
        <SectionList
          sections={this.state.filteredTransactions}
          onRefresh={this.onRefresh}
          refreshing={this.state.isFetching}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionView: {backgroundColor: colors.banner, paddingVertical: 2},

  sectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 16
  }
});
