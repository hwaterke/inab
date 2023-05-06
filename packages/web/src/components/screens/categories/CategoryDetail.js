import {
  amountFromCents,
  amountToCents,
  CategoryResource,
  getSelectedMonthMoment,
  ResourceFormProvider,
} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {crudThunks} from '../../../thunks/crudThunks'
import {Section} from '../../presentational/atoms/Section'
import {Title} from '../../presentational/atoms/Title'
import {Box} from '../../presentational/atoms/Box'
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

const mapStateToProps = (state) => ({
  selectedMonth: getSelectedMonthMoment(state),
})

export const CategoryDetail = connect(mapStateToProps)(
  class CategoryDetail extends React.Component {
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

    formToResource = (data) => {
      const hasGoal = data.goal_type && data.goal_type !== 'none'

      return {
        ...data,
        priority: parseInt(data.priority, 10),

        goal_type: hasGoal ? data.goal_type : null,

        goal_creation_month: hasGoal
          ? this.props.selectedMonth.format('YYYY-MM-DD')
          : null,

        target_balance: ['tb', 'tbd'].includes(data.goal_type)
          ? amountToCents(data.target_balance)
          : 0,

        target_balance_month:
          data.goal_type === 'tbd' ? data.target_balance_month : null,

        monthly_funding:
          data.goal_type === 'mf' ? amountToCents(data.monthly_funding) : 0,
      }
    }

    render() {
      const {match, history} = this.props

      return (
        <Section>
          <Box>
            <Title>Category</Title>

            <ResourceFormProvider
              crudThunks={crudThunks}
              uuid={match.params.uuid}
              resource={CategoryResource}
              formToResource={this.formToResource}
              resourceToForm={resourceToForm}
              postAction={history.goBack}
            >
              {(props) => <CategoryForm {...props} />}
            </ResourceFormProvider>
          </Box>
        </Section>
      )
    }
  }
)
