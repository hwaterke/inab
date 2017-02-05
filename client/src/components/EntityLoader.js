import React from 'react';
import {connect} from 'react-redux';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import {getAccounts} from '../selectors/accounts';
import {getCategoryCount} from '../selectors/categories';
import {getTransactions} from '../selectors/transactions';
import {getCategoryGroups} from '../selectors/categoryGroups';
import {getBudgetItems} from '../selectors/budgetItems';
import {bindActionCreators} from 'redux';
import {AccountResource} from '../entities/Account';
import {CategoryResource} from '../entities/Category';
import {CategoryGroupResource} from '../entities/CategoryGroup';
import {BudgetItemResource} from '../entities/BudgetItem';
import {TransactionResource} from '../entities/Transaction';

// Until we have a better solution, this component silently loads the entities on startup.
class EntityLoader extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.arrayOf(AccountResource.propType).isRequired,
    categoryGroups: React.PropTypes.arrayOf(CategoryGroupResource.propType).isRequired,
    categoryCount: React.PropTypes.number.isRequired,
    budgetItems: React.PropTypes.arrayOf(BudgetItemResource.propType).isRequired,
    transactions: React.PropTypes.arrayOf(TransactionResource.propType).isRequired,
    accountsApi: React.PropTypes.object.isRequired,
    categoryGroupsApi: React.PropTypes.object.isRequired,
    categoriesApi: React.PropTypes.object.isRequired,
    budgetItemsApi: React.PropTypes.object.isRequired,
    transactionsApi: React.PropTypes.object.isRequired,
    children: React.PropTypes.node
  };

  constructor(props) {
    super(props);
    this.state = {fetching: 5};
  }

  decrementFetch() {
    this.setState({fetching: this.state.fetching - 1});
  }

  componentDidMount() {
    if (this.props.accounts.length == 0) {
      this.props.accountsApi.fetch().then(() => this.decrementFetch());
    }
    if (this.props.categoryGroups.length == 0) {
      this.props.categoryGroupsApi.fetch().then(() => this.decrementFetch());
    }
    if (this.props.categoryCount == 0) {
      this.props.categoriesApi.fetch().then(() => this.decrementFetch());
    }
    if (this.props.budgetItems.length == 0) {
      this.props.budgetItemsApi.fetch().then(() => this.decrementFetch());
    }
    if (this.props.transactions.length == 0) {
      this.props.transactionsApi.fetch().then(() => this.decrementFetch());
    }
  }

  render() {
    return (
      <div>
        {this.state.fetching > 0 ? 'Loading...' : this.props.children}
      </div>
    );
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
  accountsApi: bindActionCreators(asyncActionCreatorsFor(AccountResource.path), dispatch),
  categoriesApi: bindActionCreators(asyncActionCreatorsFor(CategoryResource.path), dispatch),
  categoryGroupsApi: bindActionCreators(asyncActionCreatorsFor(CategoryGroupResource.path), dispatch),
  budgetItemsApi: bindActionCreators(asyncActionCreatorsFor(BudgetItemResource.path), dispatch),
  transactionsApi: bindActionCreators(asyncActionCreatorsFor(TransactionResource.path), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EntityLoader);
