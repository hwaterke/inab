import React from 'react'
import PropTypes from 'prop-types'
import {Field, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import {SimpleSelectField} from '../../forms/fields/SimpleSelectField'
import {
  CategoryResource,
  CategoryGroupResource,
  getSelectedMonthMoment,
  amountToCents,
  amountFromCents,
} from 'inab-shared'
import {FormActionBar} from '../../forms/FormActionBar'
import {arraySelector, resourceForm} from 'hw-react-shared'
import {crud} from '../../../hoc/crud'
import {InputField} from '../../forms/fields/InputField'
import {required} from '../../forms/validations'

const mapStateToProps = state => ({
  categoryGroups: arraySelector(CategoryGroupResource)(state),
  selectedMonth: getSelectedMonthMoment(state),
  goalTypeValue: selector(state, 'goal_type'),
})

function formToResource(data, ownProps) {
  return {
    ...data,
    priority: parseInt(data.priority, 10),
    goal_type: data.goal_type === 'none' ? null : data.goal_type,
    goal_creation_month:
      data.goal_type === 'none'
        ? null
        : ownProps.selectedMonth.format('YYYY-MM-DD'),
    target_balance: ['tb', 'tbd'].includes(data.goal_type)
      ? amountToCents(data.target_balance)
      : null,
    target_balance_month:
      data.goal_type === 'tbd' ? data.target_balance_month : null,
    monthly_funding:
      data.goal_type === 'mf' ? amountToCents(data.monthly_funding) : null,
  }
}

function resourceToForm(category) {
  if (category) {
    return {
      ...category,
      target_balance: amountFromCents(category.target_balance),
      monthly_funding: amountFromCents(category.monthly_funding),
    }
  }

  return {}
}

const selector = formValueSelector(CategoryResource.path)

function validateTargetBalance(value, data) {
  if (['tb', 'tbd'].includes(data.goal_type)) {
    if (!value || Number(value) <= 0) {
      return 'Must be positive'
    }
  }
  return undefined
}

function validateTargetBalanceMonth(value, data) {
  if (data.goal_type === 'tbd') {
    if (!/\d{4}-\d{2}-01/g.test(value)) {
      return 'Must be YYYY-MM-01'
    }
  }
  return undefined
}

function validateMonthlyFunding(value, data) {
  if (data.goal_type === 'mf') {
    if (!value || Number(value) <= 0) {
      return 'Must be positive'
    }
  }
  return undefined
}

@connect(mapStateToProps)
@resourceForm({
  crud,
  resource: CategoryResource,
  formToResource,
  resourceToForm,
})
export class CategoryForm extends React.Component {
  static propTypes = {
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func.isRequired,
    categoryGroups: PropTypes.arrayOf(CategoryGroupResource.propType)
      .isRequired,
    goalTypeValue: PropTypes.string,
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className="form-group">
          <label>Category group</label>
          <Field
            name="category_group_uuid"
            component={SimpleSelectField}
            placeholder="Category group"
            validate={[required]}
            options={this.props.categoryGroups.map(cg => ({
              label: cg.name,
              value: cg.uuid,
            }))}
          />
        </div>

        <Field
          name="name"
          component={InputField}
          type="text"
          label="Name"
          validate={[required]}
          required
        />

        <Field
          name="priority"
          component={InputField}
          type="number"
          label="Priority"
        />

        <div className="form-group">
          <label>Goal type</label>
          <Field name="goal_type" component="select" className="form-control">
            <option value="none">None</option>
            <option value="tb">Target balance</option>
            <option value="tbd">Target balance by date</option>
            <option value="mf">Monthly funding</option>
          </Field>
        </div>

        {['tb', 'tbd'].includes(this.props.goalTypeValue) && (
          <Field
            name="target_balance"
            component={InputField}
            type="number"
            step="0.01"
            label="Target Balance"
            validate={[validateTargetBalance]}
          />
        )}

        {this.props.goalTypeValue === 'tbd' && (
          <Field
            name="target_balance_month"
            component={InputField}
            type="text"
            label="Target Balance Month"
            validate={[validateTargetBalanceMonth]}
          />
        )}

        {this.props.goalTypeValue === 'mf' && (
          <Field
            name="monthly_funding"
            component={InputField}
            type="number"
            step="0.01"
            label="Monthly Funding"
            validate={[validateMonthlyFunding]}
          />
        )}

        <FormActionBar
          handleSubmit={this.props.handleSubmit}
          isCreate={this.props.isCreate}
          isUpdate={this.props.isUpdate}
          disableReset={this.props.pristine || this.props.submitting}
          reset={this.props.reset}
          remove={this.props.deleteResource}
        />
      </form>
    )
  }
}
