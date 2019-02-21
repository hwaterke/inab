import {CategoryGroupResource, getSelectedMonthMoment} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {Field, Form} from 'react-final-form'
import {connect} from 'react-redux'
import {select} from 'redux-crud-provider'
import {FieldCondition} from '../../forms/FieldCondition'
import {InputField} from '../../forms/fields/InputField'
import {SelectField} from '../../forms/fields/SelectField'
import {FieldValue} from '../../forms/FieldValue'
import {FormActionBar} from '../../forms/FormActionBar'
import {required} from '../../forms/validations'

const mapStateToProps = state => ({
  categoryGroups: select(CategoryGroupResource).asArray(state),
  selectedMonth: getSelectedMonthMoment(state),
})

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
export class CategoryForm extends React.Component {
  static propTypes = {
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func,
    categoryGroups: PropTypes.arrayOf(CategoryGroupResource.propTypes)
      .isRequired,

    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
  }

  render() {
    return (
      <Form
        onSubmit={this.props.onSubmit}
        initialValues={this.props.initialValues}
        render={({handleSubmit, form, pristine, submitting}) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="category_group_uuid"
              component={SelectField}
              label="Category group"
              placeholder="Category group"
              validate={required}
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
              validate={required}
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

            <FieldValue name="goal_type">
              {goal_type =>
                ['tb', 'tbd'].includes(goal_type) && (
                  <Field
                    name="target_balance"
                    component={InputField}
                    type="number"
                    step="0.01"
                    label="Target Balance"
                    validate={validateTargetBalance}
                  />
                )
              }
            </FieldValue>

            <FieldCondition when="goal_type" is="tbd">
              <Field
                name="target_balance_month"
                component={InputField}
                type="text"
                label="Target Balance Month"
                validate={validateTargetBalanceMonth}
              />
            </FieldCondition>

            <FieldCondition when="goal_type" is="mf">
              <Field
                name="monthly_funding"
                component={InputField}
                type="number"
                step="0.01"
                label="Monthly Funding"
                validate={validateMonthlyFunding}
              />
            </FieldCondition>

            <FormActionBar
              handleSubmit={handleSubmit}
              isCreate={this.props.isCreate}
              isUpdate={this.props.isUpdate}
              disableReset={pristine || submitting}
              reset={() => form.reset()}
              remove={this.props.deleteResource}
            />
          </form>
        )}
      />
    )
  }
}
