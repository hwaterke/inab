import React from 'react';
import PropTypes from 'prop-types';
import {
  AccountResource,
  CategoryResource,
  CategoryGroupResource,
  BudgetItemResource,
  TransactionResource,
  PayeeResource
} from 'inab-shared';
import {crud} from '../hoc/crud';

// Until we have a better solution, this component silently loads the entities on startup.
@crud
export class EntityLoader extends React.Component {
  static propTypes = {
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
    this.props.fetchAll(AccountResource).then(() => this.decrementFetch());
    this.props.fetchAll(CategoryGroupResource).then(() => this.decrementFetch());
    this.props.fetchAll(CategoryResource).then(() => this.decrementFetch());
    this.props.fetchAll(BudgetItemResource).then(() => this.decrementFetch());
    this.props.fetchAll(PayeeResource).then(() => this.decrementFetch());
    this.props.fetchAll(TransactionResource).then(() => this.decrementFetch());
  }

  render() {
    return (
      <div>
        {this.state.fetching > 0 ? 'Loading...' : this.props.children}
      </div>
    );
  }
}
