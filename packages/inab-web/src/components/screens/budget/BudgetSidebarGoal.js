import React from 'react'
import PropTypes from 'prop-types'
import {
  BudgetItemResource,
  CategoryResource,
  getAvailableByCategoryIdForSelectedMonth,
  getSelectedMonthBudgetItemByCategoryId,
  goalToBudgetByCategoryForSelectedMonth,
} from 'inab-shared'
import {connect} from 'react-redux'
import {Amount} from '../../Amount'
import {VictoryPie} from 'victory'
import moment from 'moment'
import {Box} from '../../presentational/atoms/Box'

const mapStateToProps = state => ({
  availableByCategory: getAvailableByCategoryIdForSelectedMonth(state),
  selectedMonthBudgetItemByCategoryId: getSelectedMonthBudgetItemByCategoryId(
    state
  ),
  goalToBudgetByCategoryForSelectedMonth: goalToBudgetByCategoryForSelectedMonth(
    state
  ),
})

@connect(mapStateToProps)
export class BudgetSidebarGoal extends React.Component {
  static propTypes = {
    category: CategoryResource.propTypes,
    availableByCategory: PropTypes.instanceOf(Map).isRequired,
    selectedMonthBudgetItemByCategoryId: PropTypes.objectOf(
      BudgetItemResource.propTypes
    ).isRequired,
    goalToBudgetByCategoryForSelectedMonth: PropTypes.objectOf(PropTypes.number)
      .isRequired,
  }

  render() {
    const {category} = this.props

    // How many percent of the goal did we reach?
    const currentGoalValue =
      category.goal_type === 'mf'
        ? this.props.selectedMonthBudgetItemByCategoryId[category.uuid] &&
          this.props.selectedMonthBudgetItemByCategoryId[category.uuid].amount
        : this.props.availableByCategory.get(category.uuid)
    const maxGoalValue =
      category.goal_type === 'mf'
        ? category.monthly_funding
        : category.target_balance
    const goalPercentage = Math.min(1, (currentGoalValue || 0) / maxGoalValue)

    return (
      <Box>
        <h5>Goal</h5>

        <b>
          {category.goal_type === 'tb' && 'Target category balance'}
          {category.goal_type === 'tbd' && 'Target category balance by date'}
          {category.goal_type === 'mf' && 'Monthly funding goal'}
        </b>

        <div
          className="py-2 my-3"
          style={{
            borderTop: '1px solid #e6e6e6',
            borderBottom: '1px solid #e6e6e6',
          }}
        >
          <div className="d-flex justify-content-between">
            <span>Creation month</span>
            <span>
              {moment(category.goal_creation_month).format('MMMM YYYY')}
            </span>
          </div>

          {category.target_balance > 0 && (
            <div className="d-flex justify-content-between">
              <span>Target balance</span>
              <span>
                <Amount amount={category.target_balance} />
              </span>
            </div>
          )}

          {category.target_balance_month && (
            <div className="d-flex justify-content-between">
              <span>Target balance month</span>
              <span>
                {moment(category.target_balance_month).format('MMMM YYYY')}
              </span>
            </div>
          )}

          {category.monthly_funding > 0 && (
            <div className="d-flex justify-content-between">
              <span>Monthly funding</span>
              <span>
                <Amount amount={category.monthly_funding} />
              </span>
            </div>
          )}

          {this.props.goalToBudgetByCategoryForSelectedMonth[category.uuid] && (
            <div className="d-flex justify-content-between">
              <span>To budget</span>
              <span>
                <Amount
                  amount={
                    this.props.goalToBudgetByCategoryForSelectedMonth[
                      category.uuid
                    ]
                  }
                />
              </span>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center">
          <div className="w-25">
            <VictoryPie
              animate={{duration: 500}}
              colorScale={['#85c9e6', '#e6e6e6']}
              innerRadius={100}
              labels={() => null}
              data={[
                {x: 'Budgeted', y: goalPercentage},
                {x: 'To budget', y: 1 - goalPercentage},
              ]}
            />
          </div>
        </div>

        <div>
          You budgeted <Amount amount={currentGoalValue} /> out of{' '}
          <Amount amount={maxGoalValue} />
        </div>
      </Box>
    )
  }
}
