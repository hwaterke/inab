import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  AccountResource,
  CategoryResource,
  CategoryGroupResource,
  BudgetItemResource,
  TransactionResource,
  PayeeResource
} from 'inab-shared';
import {arraySelector} from 'hw-react-shared';
import {crud} from '../hoc/crud';

const mapStateToProps = state => ({
  accounts: arraySelector(AccountResource)(state),
  categories: arraySelector(CategoryResource)(state),
  categoryGroups: arraySelector(CategoryGroupResource)(state),
  budgetItems: arraySelector(BudgetItemResource)(state),
  payees: arraySelector(PayeeResource)(state),
  transactions: arraySelector(TransactionResource)(state)
});

// Until we have a better solution, this component silently loads the entities on startup.
@crud
@connect(mapStateToProps)
export class EntityLoader extends React.Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(AccountResource.propType).isRequired,
    categories: PropTypes.arrayOf(CategoryResource.propType).isRequired,
    categoryGroups: PropTypes.arrayOf(CategoryGroupResource.propType).isRequired,
    budgetItems: PropTypes.arrayOf(BudgetItemResource.propType).isRequired,
    payees: PropTypes.arrayOf(PayeeResource.propType).isRequired,
    transactions: PropTypes.arrayOf(TransactionResource.propType).isRequired,
    fetchAll: PropTypes.func.isRequired,
    children: PropTypes.node
  };

  constructor(props) {
    super(props);
    this.state = {fetching: 6};
  }

  decrementFetch() {
    this.setState({fetching: this.state.fetching - 1});
  }

  componentDidMount() {
    if (this.props.accounts.length === 0) {
      this.props.fetchAll(AccountResource).then(() => this.decrementFetch());
    }
    if (this.props.categoryGroups.length === 0) {
      this.props.fetchAll(CategoryGroupResource).then(() => this.decrementFetch());
    }
    if (this.props.categories.length === 0) {
      this.props.fetchAll(CategoryResource).then(() => this.decrementFetch());
    }
    if (this.props.budgetItems.length === 0) {
      this.props.fetchAll(BudgetItemResource).then(() => this.decrementFetch());
    }
    if (this.props.payees.length === 0) {
      this.props.fetchAll(PayeeResource).then(() => this.decrementFetch());
    }
    if (this.props.transactions.length === 0) {
      this.props.fetchAll(TransactionResource).then(() => this.decrementFetch());
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
