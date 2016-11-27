import React from 'react';
import { connect } from 'react-redux';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import { getAccounts } from '../selectors/accounts';
import { getCategoryCount } from '../selectors/categories';
import { getTransactions } from '../selectors/transactions';
import { getCategoryGroups } from '../selectors/categoryGroups';
import { getBudgetItems } from '../selectors/budgetItems';
import { bindActionCreators } from 'redux';

// Until we have a better solution, this component silently loads the Account list on startup.
class EntityLoader extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.array.isRequired,
    categoryGroups: React.PropTypes.array.isRequired,
    categoryCount: React.PropTypes.number.isRequired,
    budgetItems: React.PropTypes.array.isRequired,
    transactions: React.PropTypes.array.isRequired,
    accountsApi: React.PropTypes.object.isRequired,
    categoryGroupsApi: React.PropTypes.object.isRequired,
    categoriesApi: React.PropTypes.object.isRequired,
    budgetItemsApi: React.PropTypes.object.isRequired,
    transactionsApi: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    if (this.props.accounts.length == 0) {
      this.props.accountsApi.fetch();
    }
    if (this.props.categoryGroups.length == 0) {
      this.props.categoryGroupsApi.fetch();
    }
    if (this.props.categoryCount == 0) {
      this.props.categoriesApi.fetch();
    }
    if (this.props.budgetItems.length == 0) {
      this.props.budgetItemsApi.fetch();
    }
    if (this.props.transactions.length == 0) {
      this.props.transactionsApi.fetch();
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  accounts: getAccounts(state),
  categoryCount: getCategoryCount(state),
  categoryGroups: getCategoryGroups(state),
  budgetItems: getBudgetItems(state),
  transactions: getTransactions(state)
});

const mapDispatchToProps = (dispatch) => ({
  accountsApi: bindActionCreators(asyncActionCreatorsFor('accounts'), dispatch),
  categoriesApi: bindActionCreators(asyncActionCreatorsFor('categories'), dispatch),
  categoryGroupsApi: bindActionCreators(asyncActionCreatorsFor('category_groups'), dispatch),
  budgetItemsApi: bindActionCreators(asyncActionCreatorsFor('budget_items'), dispatch),
  transactionsApi: bindActionCreators(asyncActionCreatorsFor('transactions'), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EntityLoader);
