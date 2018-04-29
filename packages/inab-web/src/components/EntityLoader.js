import React from 'react'
import PropTypes from 'prop-types'
import {
  AccountResource,
  BudgetItemResource,
  CategoryGroupResource,
  CategoryResource,
  PayeeResource,
  TransactionResource,
} from 'inab-shared'
import {connect} from 'react-redux'
import {crudThunks} from '../thunks/crudThunks'

const mapDispatchToProps = {
  fetchAll: crudThunks.fetchAll,
}

// Until we have a better solution, this component silently loads the entities on startup.
@connect(undefined, mapDispatchToProps)
export class EntityLoader extends React.Component {
  static propTypes = {
    fetchAll: PropTypes.func.isRequired,
    children: PropTypes.node,
  }

  constructor(props) {
    super(props)
    this.state = {fetching: 6}
  }

  decrementFetch() {
    this.setState({fetching: this.state.fetching - 1})
  }

  componentDidMount() {
    this.props
      .fetchAll({resource: AccountResource})
      .then(() => this.decrementFetch())
    this.props
      .fetchAll({resource: CategoryGroupResource})
      .then(() => this.decrementFetch())
    this.props
      .fetchAll({resource: CategoryResource})
      .then(() => this.decrementFetch())
    this.props
      .fetchAll({resource: BudgetItemResource})
      .then(() => this.decrementFetch())
    this.props
      .fetchAll({resource: PayeeResource})
      .then(() => this.decrementFetch())
    this.props
      .fetchAll({resource: TransactionResource})
      .then(() => this.decrementFetch())
  }

  render() {
    return (
      <div>{this.state.fetching > 0 ? 'Loading...' : this.props.children}</div>
    )
  }
}
