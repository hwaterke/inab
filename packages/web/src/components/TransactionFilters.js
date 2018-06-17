import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {deleteFilter} from '../reducers/filters'
import {getTransactionColumns} from '../selectors/transactionsRendering'
import {Filter} from '../entities/Filter'
import ButtonIcon from './ButtonIcon'
import {TransactionToolbarRow} from './TransactionToolbar'

const mapStateToProps = state => ({
  filters: state.transactionFilters,
  columns: getTransactionColumns(state),
})

const mapDispatchToProps = dispatch => ({
  onClickDelete(index) {
    dispatch(deleteFilter(index))
  },
})

@connect(mapStateToProps, mapDispatchToProps)
class TransactionFilters extends React.Component {
  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.instanceOf(Filter)).isRequired,
    columns: PropTypes.object.isRequired,
    onClickDelete: PropTypes.func.isRequired,
  }

  getAttributeLabel(name) {
    return this.props.columns[name].label
  }

  getValueLabel(filter) {
    const options = this.props.columns[filter.attribute].options
    if (options) {
      if (options instanceof Map) {
        return options.get(filter.value)
      }
    }
    return filter.value
  }

  render() {
    return (
      <TransactionToolbarRow>
        <div className="btn-group">
          {this.props.filters.map((filter, index) => (
            <ButtonIcon
              key={index}
              className="btn btn-outline-info btn-sm"
              icon="ban"
              onClick={() => this.props.onClickDelete(index)}
            >
              {this.getAttributeLabel(filter.attribute)} {filter.operator}{' '}
              {this.getValueLabel(filter)}
            </ButtonIcon>
          ))}
        </div>
      </TransactionToolbarRow>
    )
  }
}
export default TransactionFilters
