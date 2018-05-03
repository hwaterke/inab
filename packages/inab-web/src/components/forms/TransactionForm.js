import {
  AccountResource,
  CategoryResource,
  getSortedPayees,
  PayeeResource,
  TransactionResource,
} from 'inab-shared'
import PropTypes from 'prop-types'
import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {select} from 'redux-crud-provider'
import {Field, FieldArray, formValueSelector, reduxForm} from 'redux-form'
import styled from 'styled-components'
import {colors} from '../../constants/colors'
import Button from '../Button'
import ButtonDelete from '../ButtonDelete'
import ButtonIcon from '../ButtonIcon'
import DatePickerField from './fields/DatePickerField'
import {InputField} from './fields/InputField'
import {SimpleSelectField} from './fields/SimpleSelectField'
import {FormActionBar} from './FormActionBar'

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-bottom: 1px solid ${colors.border};

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
          <div className="btn-group btn-group-sm">
            <Button>{index + 1}</Button>
            <ButtonDelete onClick={() => fields.remove(index)} />
          </div>
        </div>

        <div>
          <Field
            name={`${subtransaction}.category`}
            component={SimpleSelectField}
            placeholder="Category"
            options={categories}
          />
        </div>

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
          className="btn btn-info"
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

const selector = formValueSelector(TransactionResource.name)

const mapStateToProps = state => ({
  accounts: select(AccountResource).asArray(state),
  categories: select(CategoryResource).asArray(state),
  payees: getSortedPayees(state),
  payeeValue: selector(state, 'payee'),
  categoryValue: selector(state, 'category'),
})

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

@connect(mapStateToProps)
@reduxForm({form: TransactionResource.name})
export class TransactionForm extends Component {
  static propTypes = {
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func,
    // Reference data
    accounts: PropTypes.arrayOf(AccountResource.propTypes).isRequired,
    categories: PropTypes.arrayOf(CategoryResource.propTypes).isRequired,
    payees: PropTypes.arrayOf(PayeeResource.propTypes).isRequired,
    payeeValue: PropTypes.string,
    categoryValue: PropTypes.string,
    onCancel: PropTypes.func,
  }

  render() {
    const categoryOptions = [
      {label: 'To be budgeted', value: 'tbb'},
      {label: 'Split', value: 'split'},
      ...this.props.categories.map(c => ({label: c.name, value: c.uuid})),
    ]

    const subtransactionCategoryOptions = [
      {label: 'To be budgeted', value: 'tbb'},
      ...this.props.categories.map(c => ({label: c.name, value: c.uuid})),
    ]

    const payeeOptions = [
      ...this.props.accounts.map(a => ({
        label: 'Transfer to ' + a.name,
        value: 'transfer:' + a.uuid,
      })),
      ...this.props.payees.map(c => ({label: c.name, value: c.uuid})),
    ]

    return (
      <form className="box-container">
        <FormRow>
          <div>
            <label>Account</label>
            <Field
              name="account_uuid"
              component={SimpleSelectField}
              placeholder="Account"
              options={this.props.accounts.map(cg => ({
                label: cg.name,
                value: cg.uuid,
              }))}
            />
          </div>

          <div>
            <label>Date</label>
            <div>
              <Field name="date" component={DatePickerField} />
            </div>
          </div>

          <div>
            <label>Payee</label>
            <Field
              name="payee"
              component={SimpleSelectField}
              placeholder="Payee"
              options={payeeOptions}
            />
          </div>

          <div>
            <label>Category</label>
            <Field
              name="category"
              component={SimpleSelectField}
              placeholder={
                this.props.payeeValue &&
                this.props.payeeValue.startsWith('transfer:')
                  ? 'No category for transfers'
                  : 'Category'
              }
              disabled={
                this.props.payeeValue &&
                this.props.payeeValue.startsWith('transfer:')
              }
              options={categoryOptions}
            />
          </div>

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
            validate={[validateAmount]}
          />
        </FormRow>

        {this.props.categoryValue === 'split' && (
          <FieldArray
            name="subtransactions"
            categories={subtransactionCategoryOptions}
            component={renderSubtransactions}
          />
        )}

        <FormActionBar
          handleSubmit={this.props.handleSubmit}
          isCreate={this.props.isCreate}
          isUpdate={this.props.isUpdate}
          disableReset={this.props.pristine || this.props.submitting}
          reset={this.props.reset}
          remove={this.props.deleteResource}
          cancel={this.props.onCancel}
        />
      </form>
    )
  }
}
