import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {AccountResource} from 'inab-shared/src/entities/Account';
import {CategoryResource} from 'inab-shared/src/entities/Category';
import {CategoryGroupResource} from 'inab-shared/src/entities/CategoryGroup';
import {BudgetItemResource} from 'inab-shared/src/entities/BudgetItem';
import {TransactionResource} from 'inab-shared/src/entities/Transaction';
import {crud} from '../api/crud';
import {
  selectAccounts,
  selectCategoryGroups,
  selectBudgetItems,
  selectTransactions,
  selectCategories
} from '../selectors/resources';

const mapStateToProps = state => ({
  accounts: selectAccounts(state),
  categories: selectCategories(state),
  categoryGroups: selectCategoryGroups(state),
  budgetItems: selectBudgetItems(state),
  transactions: selectTransactions(state)
});

// Until we have a better solution, this component silently loads the entities on startup.
@crud()
@connect(mapStateToProps)
export class EntityLoader extends React.Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(AccountResource.propType).isRequired,
    categories: PropTypes.arrayOf(CategoryResource.propType).isRequired,
    categoryGroups: PropTypes.arrayOf(CategoryGroupResource.propType).isRequired,
    budgetItems: PropTypes.arrayOf(BudgetItemResource.propType).isRequired,
    transactions: PropTypes.arrayOf(TransactionResource.propType).isRequired,
    fetchAll: PropTypes.func.isRequired,
    children: PropTypes.node
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
    if (this.props.categories.length == 0) {
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
