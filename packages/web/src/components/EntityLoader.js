import {
  AccountResource,
  BudgetItemResource,
  CategoryGroupResource,
  CategoryResource,
  PayeeResource,
  TransactionResource,
} from '@inab/shared'
import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {crudThunks} from '../thunks/crudThunks'
import {CenteredSpinner} from './presentational/atoms/CenteredSpinner'

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
      .fetchAll({resource: AccountResource, replace: true})
      .finally(() => this.decrementFetch())
    this.props
      .fetchAll({resource: CategoryGroupResource, replace: true})
      .finally(() => this.decrementFetch())
    this.props
      .fetchAll({resource: CategoryResource, replace: true})
      .finally(() => this.decrementFetch())
    this.props
      .fetchAll({resource: BudgetItemResource, replace: true})
      .finally(() => this.decrementFetch())
    this.props
      .fetchAll({resource: PayeeResource, replace: true})
      .finally(() => this.decrementFetch())
    this.props
      .fetchAll({resource: TransactionResource, replace: true})
      .finally(() => this.decrementFetch())
  }

  render() {
    return (
      <Fragment>
        {this.state.fetching > 0 ? <CenteredSpinner /> : this.props.children}
      </Fragment>
    )
  }
}
