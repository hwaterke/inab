import React from 'react'
import PropTypes from 'prop-types'
import {View, SectionList, Text} from 'react-native'
import {connect} from 'react-redux'
import {TransactionResource} from '@inab/shared'
import moment from 'moment'
import {groupBy} from 'ramda'
import {ResourceListProvider} from 'redux-crud-provider'
import {globalStyles} from '../../../constants/styles'
import {getTransactionForRendering} from '../../../selectors/transactions'
import {crudThunks} from '../../../thunks/crudThunks'
import {TransactionRow} from './TransactionRow'

const mapStateToProps = (state) => ({
  transactions: getTransactionForRendering(state),
})

@connect(mapStateToProps)
export class TransactionListScreen extends React.Component {
  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionResource.propTypes).isRequired,
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          accountUuid: PropTypes.string,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }

  state = {
    filteredTransactions: [],
  }

  filterTransactions = (transactions) => {
    const {accountUuid} = this.props.navigation.state.params

    const sections = Object.entries(
      groupBy(
        (tr) => moment(tr.date, 'YYYY-MM-DD').format('D MMMM YYYY'),
        transactions.filter(
          (tr) => !accountUuid || tr.account_uuid === accountUuid
        )
      )
    ).map((en) => ({title: en[0], data: en[1]}))

    this.setState({
      filteredTransactions: sections,
    })
  }

  componentDidMount() {
    this.filterTransactions(this.props.transactions)
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.navigation.state.params !==
        nextProps.navigation.state.params ||
      this.props.transactions !== nextProps.transactions
    ) {
      this.filterTransactions(nextProps.transactions)
    }
  }

  renderItem = ({item}) => <TransactionRow transaction={item} />

  renderSectionHeader = ({section}) => (
    <View style={globalStyles.sectionView}>
      <Text style={globalStyles.sectionText}>{section.title}</Text>
    </View>
  )

  render() {
    return (
      <View style={globalStyles.screen}>
        <ResourceListProvider
          crudThunks={crudThunks}
          resource={TransactionResource}
          replace
          autoFetch
        >
          {({fetchAll, loading}) => (
            <SectionList
              sections={this.state.filteredTransactions}
              onRefresh={fetchAll}
              refreshing={loading}
              renderItem={this.renderItem}
              renderSectionHeader={this.renderSectionHeader}
            />
          )}
        </ResourceListProvider>
      </View>
    )
  }
}
