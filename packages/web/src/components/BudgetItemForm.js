import {BudgetItemResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {Field, reduxForm} from 'redux-form'

@reduxForm({form: BudgetItemResource.name})
export class BudgetItemForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          name="amount"
          className="form-control"
          onBlur={this.props.onBlur}
          component="input"
          type="number"
          step="0.01"
          placeholder="Amount"
          autoFocus
        />
      </form>
    )
  }
}
