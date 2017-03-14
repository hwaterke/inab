import React from 'react';
import {Field} from 'redux-form';
import {resourceForm} from './forms/resourceForm';
import {BudgetItemResource} from '../entities/BudgetItem';
import {amountToCents} from '../utils/amount';
import {connect} from 'react-redux';
import {getCurrentMonth} from '../selectors/ui';

const mapStateToProps = (state) => ({
  selectedMonth: getCurrentMonth(state)
});

class BudgetItemForm extends React.Component {
  static propTypes = {
    updatedResource: BudgetItemResource.propType,
    category_uuid: React.PropTypes.string,
    handleSubmit: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired,
    selectedMonth: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          name="amount"
          className="form-control"
          onBlur={this.props.onBlur}
          component="input"
          type="text"
          placeholder="Amount"
          autoFocus
        />
      </form>
    );
  }
}

const formToResource = (data, props) => ({
  month: props.selectedMonth.format('YYYY-MM-DD'),
  category_uuid: props.category_uuid,
  amount: amountToCents(data.amount)
});

const resourceToForm = () => ({});

export default connect(mapStateToProps)(resourceForm(BudgetItemResource.path, formToResource, resourceToForm)(BudgetItemForm));
