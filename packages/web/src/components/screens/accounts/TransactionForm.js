import {
  AccountResource,
  CategoryResource,
  getCategorySuggestions,
  getSortedPayees,
  PayeeResource,
} from '@inab/shared'
import arrayMutators from 'final-form-arrays'
import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import {Field, Form} from 'react-final-form'
import {FieldArray} from 'react-final-form-arrays'
import {connect} from 'react-redux'
import {select} from 'redux-crud-provider'
import styled from 'styled-components'
import {DatePickerField} from '../../forms/fields/DatePickerField'
import {InputField} from '../../forms/fields/InputField'
import {SelectField} from '../../forms/fields/SelectField'
import {FieldValue} from '../../forms/FieldValue'
import {FormActionBar} from '../../forms/FormActionBar'
import {required} from '../../forms/validations'
import {Box} from '../../presentational/atoms/Box'
import {Button} from '../../presentational/atoms/Button'
import {ButtonIcon} from '../../presentational/atoms/ButtonIcon'
import {Section} from '../../presentational/atoms/Section'

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  &:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.03);
  }

  > div {
    flex: 1 1 150px;
    padding: 0.5rem;
  }
`

/**
 * Component used for rendering the subtransaction forms
 */
const renderSubtransactions = ({fields, categories}) => (
  <Fragment>
    {fields.map((subtransaction, index) => (
      <FormRow key={index}>
        <div />
        <div />

        <div>
          <div className="buttons has-addons">
            <Button type="button">{index + 1}</Button>
            <ButtonIcon
              type="button"
              onClick={() => fields.remove(index)}
              icon="trash"
              color="danger"
            />
          </div>
        </div>

        <Field
          name={`${subtransaction}.category`}
          component={SelectField}
          placeholder="Category"
          options={categories}
        />

        <Field
          name={`${subtransaction}.description`}
          component={InputField}
          type="text"
          placeholder="Description"
        />

        <Field
          name={`${subtransaction}.amount`}
          component={InputField}
          type="number"
          step="0.01"
          placeholder="Amount"
        />
      </FormRow>
    ))}
    <FormRow>
      <div />
      <div />
      <div>
        <ButtonIcon
          type="button"
          color="info"
          onClick={() => fields.push({})}
          icon="plus"
        >
          Subtransaction
        </ButtonIcon>
      </div>
      <div />
      <div />
      <div />
    </FormRow>
  </Fragment>
)

renderSubtransactions.propTypes = {
  fields: PropTypes.object.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
}

function validateAmount(value, data) {
  if (data.subtransactions && data.subtransactions.length > 0) {
    const sum = data.subtransactions
      .map(st => Number(st.amount) || 0)
      .reduce((acc, value) => acc + value, 0)
    if (sum !== Number(value)) {
      return "Sum doesn't match subtransactions"
    }
  }
  return undefined
}

const mapStateToProps = state => ({
  accounts: select(AccountResource).asArray(state),
  categories: select(CategoryResource).asArray(state),
  payees: getSortedPayees(state),
  getCategorySuggestions: getCategorySuggestions(state),
})

export const TransactionForm = connect(mapStateToProps)(
  class TransactionForm extends React.Component {
    static propTypes = {
      isCreate: PropTypes.bool.isRequired,
      isUpdate: PropTypes.bool.isRequired,
      deleteResource: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
      initialValues: PropTypes.object,
      onCancel: PropTypes.func,

      accounts: PropTypes.arrayOf(AccountResource.propTypes).isRequired,
      categories: PropTypes.arrayOf(CategoryResource.propTypes).isRequired,
      payees: PropTypes.arrayOf(PayeeResource.propTypes).isRequired,
      getCategorySuggestions: PropTypes.func.isRequired,
    }

    renderCategorySuggestion(categories, form) {
      if (categories) {
        return (
          <ul>
            {categories.map(category => (
              <li key={category.uuid}>
                <a
                  role="button"
                  onClick={() => form.change('category', category.uuid)}
                >
                  {category.name} ?
                </a>
              </li>
            ))}
          </ul>
        )
      }
    }

    render() {
      const {accounts, categories, payees, getCategorySuggestions} = this.props

      const payeeOptions = [
        ...this.props.accounts.map(a => ({
          label: 'Transfer to ' + a.name,
          value: 'transfer:' + a.uuid,
        })),
        ...payees.map(c => ({label: c.name, value: c.uuid})),
      ]

      const categoryOptions = [
        {label: 'To be budgeted', value: 'tbb'},
        {label: 'Split', value: 'split'},
        ...categories.map(c => ({label: c.name, value: c.uuid})),
      ]

      const subtransactionCategoryOptions = [
        {label: 'To be budgeted', value: 'tbb'},
        ...categories.map(c => ({label: c.name, value: c.uuid})),
      ]

      return (
        <Form
          onSubmit={this.props.onSubmit}
          initialValues={this.props.initialValues}
          mutators={arrayMutators}
        >
          {({handleSubmit, form, pristine, submitting}) => (
            <Section>
              <Box>
                <form>
                  <FormRow>
                    <Field
                      name="account_uuid"
                      component={SelectField}
                      label="Account"
                      placeholder="Account"
                      validate={required}
                      options={accounts.map(cg => ({
                        label: cg.name,
                        value: cg.uuid,
                      }))}
                    />

                    <Field
                      name="date"
                      component={DatePickerField}
                      label="Date"
                    />

                    <Field
                      name="payee"
                      component={SelectField}
                      label="Payee"
                      placeholder="Payee"
                      options={payeeOptions}
                    />

                    <FieldValue name="payee">
                      {payee => (
                        <div>
                          <Field
                            name="category"
                            component={SelectField}
                            label="Category"
                            placeholder={
                              !!payee && payee.startsWith('transfer:')
                                ? 'No category for transfers'
                                : 'Category'
                            }
                            disabled={!!payee && payee.startsWith('transfer:')}
                            options={categoryOptions}
                          />

                          <FieldValue name="category">
                            {category =>
                              !category &&
                              this.renderCategorySuggestion(
                                getCategorySuggestions(payee),
                                form
                              )
                            }
                          </FieldValue>
                        </div>
                      )}
                    </FieldValue>

                    <Field
                      name="description"
                      component={InputField}
                      type="text"
                      label="Description"
                    />

                    <Field
                      name="amount"
                      component={InputField}
                      type="number"
                      step="0.01"
                      label="Amount"
                      validate={validateAmount}
                    />
                  </FormRow>

                  <FieldValue name="category">
                    {category =>
                      category === 'split' && (
                        <FieldArray
                          name="subtransactions"
                          categories={subtransactionCategoryOptions}
                          component={renderSubtransactions}
                        />
                      )
                    }
                  </FieldValue>

                  <FormActionBar
                    handleSubmit={handleSubmit}
                    isCreate={this.props.isCreate}
                    isUpdate={this.props.isUpdate}
                    disableReset={pristine || submitting}
                    reset={() => form.reset()}
                    remove={this.props.deleteResource}
                    cancel={this.props.onCancel}
                  />
                </form>
              </Box>
            </Section>
          )}
        </Form>
      )
    }
  }
)
