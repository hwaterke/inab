import React from 'react';
import {reduxForm} from 'redux-form';
import ui from 'redux-ui';

@ui()
class BudgetItemForm extends React.Component {
  static propTypes = {
    fields: React.PropTypes.object.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired
  }

  render() {
    const {
      fields: { amount },
      handleSubmit
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" className='form-control' placeholder="Amount" autoFocus {...amount}/>
      </form>
    );
  }
}

export default reduxForm({
  form: 'budgetItem',
  fields: ['amount']
})(BudgetItemForm);
