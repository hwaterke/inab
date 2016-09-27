import React from 'react';
import { Field, reduxForm } from 'redux-form';
import ui from 'redux-ui';

@ui()
class BudgetItemForm extends React.Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func.isRequired,
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field name="amount" component="input" type="text" className='form-control' placeholder="Amount" autoFocus />
      </form>
    );
  }
}

export default reduxForm({form: 'budgetItem'})(BudgetItemForm);
