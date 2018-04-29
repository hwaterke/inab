import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {AccountHeader} from './AccountHeader'
import TransactionContainer from '../../TransactionContainer'
import {
  AccountResource,
  getBudgetBalance,
  selectBalanceByAccountId,
} from 'inab-shared'
import {setFilter} from '../../../reducers/filters'
import {select} from 'redux-crud-provider'
import {Filter} from '../../../entities/Filter'

const mapStateToProps = (state, ownProps) => {
  let title = 'All'
  let balance = getBudgetBalance(state)

  const aid = ownProps.match.params.uuid

  if (aid) {
    // Check if the account exist./
    const account = select(AccountResource).byId(state)[aid]
    if (account) {
      title = account.name
      balance = selectBalanceByAccountId(state)[aid]
    }
  }

  return {
    title,
    balance,
  }
}

const mapDispatchToProps = {
  setFilter,
}

@connect(mapStateToProps, mapDispatchToProps)
export class AccountPage extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    balance: PropTypes.number,
    match: PropTypes.shape({
      params: PropTypes.shape({
        uuid: PropTypes.string,
      }).isRequired,
    }).isRequired,
    setFilter: PropTypes.func.isRequired,
  }

  applyFilter(params) {
    if (params.date && params.category_uuid) {
      this.props.setFilter([
        new Filter('date', ':', params.date),
        new Filter('category_uuid', '=', params.category_uuid),
      ])
    } else {
      this.props.setFilter([])
    }
  }

  componentDidMount() {
    this.applyFilter(this.props.match.params)
  }

  componentWillReceiveProps(nextProps) {
    const currentParams = this.props.match.params
    const nextParams = nextProps.match.params
    if (
      currentParams.date !== nextParams.date ||
      currentParams.category_uuid !== nextParams.category_uuid
    ) {
      this.applyFilter(nextParams)
    }
  }

  render() {
    const selectedAccountId = this.props.match.params.uuid

    return (
      <div>
        <AccountHeader name={this.props.title} balance={this.props.balance} />
        <TransactionContainer
          accountId={selectedAccountId}
          hideAccount={!!selectedAccountId}
        />
      </div>
    )
  }
}
