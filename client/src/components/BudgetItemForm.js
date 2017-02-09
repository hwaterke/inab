import React from 'react';
import {Field} from 'redux-form';
import {resourceForm} from './forms/resourceForm';
import {BudgetItemResource} from '../entities/BudgetItem';
import moment from 'moment';
import {amountToCents} from '../utils/amount';

class BudgetItemForm extends React.Component {
  static propTypes = {
    updatedResource: BudgetItemResource.propType,
    year: React.PropTypes.number.isRequired,
    month: React.PropTypes.number.isRequired,
    category_id: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    handleSubmit: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired
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

const formToResource = (data, props) => {
  const month = moment([props.year, props.month - 1]);
  return {
    month: month.format('YYYY-MM-DD'),
    category_id: props.category_id,
    amount: amountToCents(data.amount)
  };
};

const resourceToForm = () => ({});

export default resourceForm(BudgetItemResource.path, formToResource, resourceToForm)(BudgetItemForm);
