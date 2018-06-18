import {
  BudgetItemResource,
  CategoryResource,
  getAvailableByCategoryIdForSelectedMonth,
  getSelectedMonthBudgetItemByCategoryId,
  goalToBudgetByCategoryForSelectedMonth,
} from '@inab/shared'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {VictoryPie} from 'victory'
import {Amount} from '../../Amount'
import {Box} from '../../presentational/atoms/Box'
import {Row} from '../../presentational/atoms/Row'
import {Subtitle} from '../../presentational/atoms/Subtitle'
import {Title} from '../../presentational/atoms/Title'

const GoalDetails = styled.div`
  margin: 1rem 0;
  padding .5rem 0;
    border-top:1px solid #e6e6e6;
            border-bottom: 1px solid #e6e6e6;
`

const ChartContainer = styled.div`
  width: 40%;
`

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
        <Title>Goal</Title>

        <Subtitle>
          {category.goal_type === 'tb' && 'Target category balance'}
          {category.goal_type === 'tbd' && 'Target category balance by date'}
          {category.goal_type === 'mf' && 'Monthly funding goal'}
        </Subtitle>

        <GoalDetails>
          <Row>
            <span>Creation month</span>
            <span>
              {moment(category.goal_creation_month).format('MMMM YYYY')}
            </span>
          </Row>

          {category.target_balance > 0 && (
            <Row>
              <span>Target balance</span>
              <span>
                <Amount amount={category.target_balance} />
              </span>
            </Row>
          )}

          {category.target_balance_month && (
            <Row>
              <span>Target balance month</span>
              <span>
                {moment(category.target_balance_month).format('MMMM YYYY')}
              </span>
            </Row>
          )}

          {category.monthly_funding > 0 && (
            <Row>
              <span>Monthly funding</span>
              <span>
                <Amount amount={category.monthly_funding} />
              </span>
            </Row>
          )}

          {this.props.goalToBudgetByCategoryForSelectedMonth[category.uuid] && (
            <Row>
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
            </Row>
          )}
        </GoalDetails>

        <Row justifyContent="center">
          <ChartContainer>
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
          </ChartContainer>
        </Row>

        <div>
          You budgeted <Amount amount={currentGoalValue} /> out of{' '}
          <Amount amount={maxGoalValue} />
        </div>
      </Box>
    )
  }
}
