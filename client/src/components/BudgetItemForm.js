import React from 'react';
import { Field, reduxForm } from 'redux-form';

class BudgetItemForm extends React.Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field name="amount" className="form-control" onBlur={this.props.onBlur} component="input" type="text" placeholder="Amount" autoFocus />
      </form>
    );
  }
}

export default reduxForm({form: 'budgetItem'})(BudgetItemForm);
