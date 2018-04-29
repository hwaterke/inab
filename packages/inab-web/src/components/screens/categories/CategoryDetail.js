import {
  amountFromCents,
  amountToCents,
  CategoryResource,
  getSelectedMonthMoment,
} from 'inab-shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {ResourceFormProvider} from '../../../providers/ResourceFormProvider'
import {CategoryForm} from './CategoryForm'

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

const mapStateToProps = state => ({
  selectedMonth: getSelectedMonthMoment(state),
})

@connect(mapStateToProps)
export class CategoryDetail extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        uuid: PropTypes.string,
      }).isRequired,
    }).isRequired,

    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,

    selectedMonth: PropTypes.object.isRequired,
  }

  formToResource = data => ({
    ...data,
    priority: parseInt(data.priority, 10),
    goal_type: data.goal_type === 'none' ? null : data.goal_type,
    goal_creation_month:
      data.goal_type === 'none'
        ? null
        : this.props.selectedMonth.format('YYYY-MM-DD'),
    target_balance: ['tb', 'tbd'].includes(data.goal_type)
      ? amountToCents(data.target_balance)
      : null,
    target_balance_month:
      data.goal_type === 'tbd' ? data.target_balance_month : null,
    monthly_funding:
      data.goal_type === 'mf' ? amountToCents(data.monthly_funding) : null,
  })

  render() {
    const {match, history} = this.props

    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="mt-4 p-4 box">
              <h4>Category</h4>

              <ResourceFormProvider
                uuid={match.params.uuid}
                resource={CategoryResource}
                formToResource={this.formToResource}
                resourceToForm={resourceToForm}
                postAction={history.goBack}
              >
                {props => <CategoryForm {...props} />}
              </ResourceFormProvider>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
