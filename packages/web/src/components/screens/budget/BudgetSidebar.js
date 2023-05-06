import {
  BudgetItemResource,
  CategoryResource,
  getAvailableByCategoryIdForSelectedMonth,
  getAvailableToBudget,
  getBudgetedThisMonth,
  getSelectedMonthBudgetItemByCategoryId,
  getSelectedMonthMoment,
  getToBeBudgetedSumInSelectedMonth,
  goalToBudgetByCategoryForSelectedMonth,
} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {select} from 'redux-crud-provider'
import ui from 'redux-ui'
import {crudThunks} from '../../../thunks/crudThunks'
import {Amount} from '../../Amount'
import {Button} from '../../presentational/atoms/Button'
import {Box} from '../../presentational/atoms/Box'
import {ValueHighlight} from '../../presentational/atoms/ValueHighlight'
import {BudgetSidebarCategory} from './BudgetSidebarCategory'

const mapStateToProps = (state) => ({
  categories: select(CategoryResource).asArray(state),
  categoriesById: select(CategoryResource).byId(state),
  availableToBudget: getAvailableToBudget(state),
  availableByCategory: getAvailableByCategoryIdForSelectedMonth(state),
  selectedMonth: getSelectedMonthMoment(state),
  selectedMonthBudgetItemByCategoryId:
    getSelectedMonthBudgetItemByCategoryId(state),
  budgetedThisMonth: getBudgetedThisMonth(state),
  inflowInCurrentMonth: getToBeBudgetedSumInSelectedMonth(state),
  goalToBudgetByCategoryForSelectedMonth:
    goalToBudgetByCategoryForSelectedMonth(state),
})

const mapDispatchToProps = {
  createResource: crudThunks.createResource,
  updateResource: crudThunks.updateResource,
}

export const BudgetSidebar = ui()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    class BudgetSidebar extends React.Component {
      static propTypes = {
        categories: PropTypes.arrayOf(CategoryResource.propTypes).isRequired,
        categoriesById: PropTypes.objectOf(CategoryResource.propTypes)
          .isRequired,
        availableToBudget: PropTypes.number.isRequired,
        availableByCategory: PropTypes.instanceOf(Map).isRequired,
        selectedMonth: PropTypes.object.isRequired,
        selectedMonthBudgetItemByCategoryId: PropTypes.objectOf(
          BudgetItemResource.propTypes
        ).isRequired,
        budgetedThisMonth: PropTypes.number.isRequired,
        inflowInCurrentMonth: PropTypes.number.isRequired,
        goalToBudgetByCategoryForSelectedMonth: PropTypes.objectOf(
          PropTypes.number
        ).isRequired,
        createResource: PropTypes.func.isRequired,
        updateResource: PropTypes.func.isRequired,
        ui: PropTypes.shape({
          categorySelected: PropTypes.string,
        }).isRequired,
      }

      state = {
        budgeting: false,
      }

      /**
       * Adds the specified amount to the category
       */
      budgetCategoryAdd = (categoryUuid, amount) => {
        const existingBudgetItem =
          this.props.selectedMonthBudgetItemByCategoryId[categoryUuid]

        if (existingBudgetItem) {
          // Update
          return this.props.updateResource({
            resource: BudgetItemResource,
            entity: {
              ...existingBudgetItem,
              amount: amount + existingBudgetItem.amount,
            },
          })
        } else {
          // Create
          return this.props.createResource({
            resource: BudgetItemResource,
            entity: {
              month: this.props.selectedMonth.format('YYYY-MM-DD'),
              category_uuid: categoryUuid,
              amount,
            },
          })
        }
      }

      quickBudgetUnderfunded = async () => {
        this.setState({budgeting: true})
        let availableToBudget = this.props.availableToBudget

        for (let category of this.props.categories) {
          const available = this.props.availableByCategory.get(category.uuid)
          if (available < 0) {
            const adding = Math.min(-available, availableToBudget)
            if (adding > 0) {
              await this.budgetCategoryAdd(category.uuid, adding)
              availableToBudget -= adding
            }
          }
        }
        this.setState({budgeting: false})
      }

      quickBudgetGoals = async () => {
        this.setState({budgeting: true})
        let availableToBudget = this.props.availableToBudget

        for (let category of this.props.categories) {
          const missingForGoal =
            this.props.goalToBudgetByCategoryForSelectedMonth[category.uuid]
          if (missingForGoal > 0) {
            const adding = Math.min(missingForGoal, availableToBudget)
            if (adding > 0) {
              await this.budgetCategoryAdd(category.uuid, adding)
              availableToBudget -= adding
            }
          }
        }
        this.setState({budgeting: false})
      }

      render() {
        const {
          ui: {categorySelected},
          categoriesById,
        } = this.props

        if (categorySelected) {
          return (
            <BudgetSidebarCategory
              category={categoriesById[categorySelected]}
            />
          )
        }

        return (
          <Box>
            <ValueHighlight name="Total budgeted">
              <Amount amount={-this.props.budgetedThisMonth} />
            </ValueHighlight>

            <ValueHighlight name="Total inflows">
              <Amount amount={this.props.inflowInCurrentMonth} />
            </ValueHighlight>

            <div className="field">
              {!this.state.budgeting && (
                <Button onClick={this.quickBudgetUnderfunded} isWide>
                  Quick budget underfunded
                </Button>
              )}
            </div>
            <div className="field">
              {!this.state.budgeting && (
                <Button onClick={this.quickBudgetGoals} isWide>
                  Quick budget goals
                </Button>
              )}
            </div>
          </Box>
        )
      }
    }
  )
)
