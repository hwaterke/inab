import {
  CategoryGroupResource,
  CategoryResource,
  getSelectedMonthMoment,
} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {select} from 'redux-crud-provider'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {InputField} from '../../forms/fields/InputField'
import {SelectField} from '../../forms/fields/SelectField'
import {FormActionBar} from '../../forms/FormActionBar'
import {required} from '../../forms/validations'

const mapStateToProps = state => ({
  categoryGroups: select(CategoryGroupResource).asArray(state),
  selectedMonth: getSelectedMonthMoment(state),
  goalTypeValue: selector(state, 'goal_type'),
})

const selector = formValueSelector(CategoryResource.name)

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

const goalOptions = [
  {label: 'None', value: 'none'},
  {label: 'Target balance', value: 'tb'},
  {label: 'Target balance by date', value: 'tbd'},
  {label: 'Monthly funding', value: 'mf'},
]

@connect(mapStateToProps)
@reduxForm({form: CategoryResource.name})
export class CategoryForm extends React.Component {
  static propTypes = {
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func,
    categoryGroups: PropTypes.arrayOf(CategoryGroupResource.propTypes)
      .isRequired,
    goalTypeValue: PropTypes.string,
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          name="category_group_uuid"
          component={SelectField}
          label="Category group"
          placeholder="Category group"
          validate={[required]}
          options={this.props.categoryGroups.map(cg => ({
            label: cg.name,
            value: cg.uuid,
          }))}
        />

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

        <Field
          name="goal_type"
          component={SelectField}
          label="Goal type"
          placeholder="Goal"
          options={goalOptions}
        />

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
