import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
  AccountResource,
  getBudgetBalance,
  selectBalanceByAccountId,
} from '@inab/shared'
import {select} from 'redux-crud-provider'
import TransactionContainer from '../../TransactionContainer'
import {setFilter} from '../../../reducers/filters'
import {Filter} from '../../../entities/Filter'
import {AccountHeader} from './AccountHeader'

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

@connect(
  mapStateToProps,
  mapDispatchToProps
)
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

  componentDidUpdate(prevProps) {
    const prevParams = prevProps.match.params
    const currentParams = this.props.match.params
    if (
      currentParams.date !== prevParams.date ||
      currentParams.category_uuid !== prevParams.category_uuid
    ) {
      this.applyFilter(prevParams)
    }
  }

  render() {
    const selectedAccountId = this.props.match.params.uuid

    return (
      <Fragment>
        <AccountHeader name={this.props.title} balance={this.props.balance} />
        <TransactionContainer
          accountId={selectedAccountId}
          hideAccount={!!selectedAccountId}
        />
      </Fragment>
    )
  }
}
