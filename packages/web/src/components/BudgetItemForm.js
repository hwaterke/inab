import React from 'react'
import PropTypes from 'prop-types'
import {Field} from 'redux-form'
import {
  amountToCents,
  BudgetItemResource,
  getSelectedMonthMoment,
} from 'inab-shared'
import {connect} from 'react-redux'
import {resourceForm} from 'hw-react-shared'
import {crud} from '../hoc/crud'

const mapStateToProps = state => ({
  selectedMonth: getSelectedMonthMoment(state),
})

const formToResource = (data, props) => ({
  month: props.selectedMonth.format('YYYY-MM-DD'),
  category_uuid: props.category_uuid,
  amount: amountToCents(data.amount),
})

const resourceToForm = () => ({})

@connect(mapStateToProps)
@resourceForm({
  crud,
  resource: BudgetItemResource,
  formToResource,
  resourceToForm,
})
export class BudgetItemForm extends React.Component {
  static propTypes = {
    updatedResource: BudgetItemResource.propType,
    deleteResource: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    postSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    selectedMonth: PropTypes.object.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    category_uuid: PropTypes.string,
  }

  onSubmit = data => {
    if (Number(data.amount) === 0) {
      if (this.props.updatedResource) {
        this.props.deleteResource()
      }
    } else {
      this.props.onSubmit(data)
    }
    this.props.postSubmit()
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
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
