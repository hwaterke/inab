import {
  amountToCents,
  BudgetItemResource,
  getSelectedMonthMoment,
  ResourceFormProvider,
} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {Field, Form} from 'react-final-form'
import {connect} from 'react-redux'
import {crudThunks} from '../thunks/crudThunks'

const mapStateToProps = state => ({
  selectedMonth: getSelectedMonthMoment(state),
})

@connect(mapStateToProps)
export class BudgetItemForm extends React.Component {
  static propTypes = {
    uuid: PropTypes.string,
    category_uuid: PropTypes.string.isRequired,
    selectedMonth: PropTypes.object.isRequired,
    postSubmit: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  }

  formToResource = data => ({
    month: this.props.selectedMonth.format('YYYY-MM-DD'),
    category_uuid: this.props.category_uuid,
    amount: amountToCents(data.amount),
  })

  onSubmit = ({onSubmit, isUpdate, deleteResource}) => data => {
    if (Number(data.amount) === 0) {
      if (isUpdate) {
        deleteResource()
      }
    } else {
      onSubmit(data)
    }
    this.props.postSubmit()
  }

  render() {
    const {uuid, onBlur} = this.props

    return (
      <ResourceFormProvider
        crudThunks={crudThunks}
        uuid={uuid}
        resource={BudgetItemResource}
        formToResource={this.formToResource}
      >
        {({onSubmit, isUpdate, deleteResource}) => (
          <Form onSubmit={this.onSubmit({onSubmit, isUpdate, deleteResource})}>
            {({handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                <Field
                  name="amount"
                  className="form-control"
                  onBlur={onBlur}
                  component="input"
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  autoFocus
                />
              </form>
            )}
          </Form>
        )}
      </ResourceFormProvider>
    )
  }
}
