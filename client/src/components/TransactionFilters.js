import React from 'react';
import {connect} from 'react-redux';
import ButtonIcon from './ButtonIcon';
import {deleteFilter} from '../reducers/filters';
import {getTransactionColumns} from '../selectors/transactionsRendering';
import {Filter} from '../entities/Filter';

const mapStateToProps = (state) => ({
  filters: state.transactionFilters,
  columns: getTransactionColumns(state)
});

const mapDispatchToProps = (dispatch) => ({
  onClickDelete(index) {
    dispatch(deleteFilter(index));
  }
});

@connect(mapStateToProps, mapDispatchToProps)
class TransactionFilters extends React.Component {

  static propTypes = {
    filters: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Filter)).isRequired,
    columns: React.PropTypes.object.isRequired,
    onClickDelete: React.PropTypes.func.isRequired
  };

  getAttributeLabel(name) {
    return this.props.columns[name].label;
  }

  getValueLabel(filter) {
    const options = this.props.columns[filter.attribute].options;
    if (options) {
      if (options instanceof Map) {
        return options.get(filter.value);
      }
    }
    return filter.value;
  }

  render() {
    return (
      <div className="transaction-toolbar">
        <div className="btn-group">
          {this.props.filters.map((filter, index) => (
            <ButtonIcon
              key={index}
              className="btn btn-outline-info btn-sm"
              icon="ban"
              onClick={() => this.props.onClickDelete(index)}>
              {this.getAttributeLabel(filter.attribute)} {filter.operator} {this.getValueLabel(filter)}
            </ButtonIcon>
          ))}
        </div>
      </div>
    );
  }
}
export default TransactionFilters;
