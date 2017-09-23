import React from 'react';
import PropTypes from 'prop-types';
import {
  CategoryResource,
  goalToBudgetByCategoryForSelectedMonth
} from 'inab-shared';
import {connect} from 'react-redux';
import Amount from '../../Amount';

const mapStateToProps = state => ({
  goalToBudgetByCategoryForSelectedMonth: goalToBudgetByCategoryForSelectedMonth(
    state
  )
});

@connect(mapStateToProps)
export class BudgetSidebarGoal extends React.Component {
  static propTypes = {
    category: CategoryResource.propType,
    goalToBudgetByCategoryForSelectedMonth: PropTypes.objectOf(PropTypes.number)
      .isRequired
  };

  render() {
    const {category} = this.props;

    return (
      <div className="mt-3 p-4 box">
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
            borderBottom: '1px solid #e6e6e6'
          }}
        >
          <div className="d-flex justify-content-between">
            <span>Creation month</span>
            <span>{category.goal_creation_month}</span>
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
              <span>{category.target_balance_month}</span>
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
      </div>
    );
  }
}
