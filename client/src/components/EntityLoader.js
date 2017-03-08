import React from 'react';
import {connect} from 'react-redux';
import {getAccounts} from '../selectors/accounts';
import {getCategoryCount} from '../selectors/categories';
import {getTransactions} from '../selectors/transactions';
import {getCategoryGroups} from '../selectors/categoryGroups';
import {getBudgetItems} from '../selectors/budgetItems';
import {AccountResource} from '../entities/Account';
import {CategoryGroupResource} from '../entities/CategoryGroup';
import {BudgetItemResource} from '../entities/BudgetItem';
import {TransactionResource} from '../entities/Transaction';
import {crud} from '../api/crud';
import {CategoryResource} from '../entities/Category';

const mapStateToProps = (state) => ({
  accounts: getAccounts(state),
  categoryCount: getCategoryCount(state),
  categoryGroups: getCategoryGroups(state),
  budgetItems: getBudgetItems(state),
  transactions: getTransactions(state)
});

// Until we have a better solution, this component silently loads the entities on startup.
@crud()
@connect(mapStateToProps)
export class EntityLoader extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.arrayOf(AccountResource.propType).isRequired,
    categoryGroups: React.PropTypes.arrayOf(CategoryGroupResource.propType).isRequired,
    categoryCount: React.PropTypes.number.isRequired,
    budgetItems: React.PropTypes.arrayOf(BudgetItemResource.propType).isRequired,
    transactions: React.PropTypes.arrayOf(TransactionResource.propType).isRequired,
    fetchAll: React.PropTypes.func.isRequired,
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
      this.props.fetchAll(AccountResource.path).then(() => this.decrementFetch());
    }
    if (this.props.categoryGroups.length == 0) {
      this.props.fetchAll(CategoryGroupResource.path).then(() => this.decrementFetch());
    }
    if (this.props.categoryCount == 0) {
      this.props.fetchAll(CategoryResource.path).then(() => this.decrementFetch());
    }
    if (this.props.budgetItems.length == 0) {
      this.props.fetchAll(BudgetItemResource.path).then(() => this.decrementFetch());
    }
    if (this.props.transactions.length == 0) {
      this.props.fetchAll(TransactionResource.path).then(() => this.decrementFetch());
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
