import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {
  getAvailableToBudget,
  getBudgetedInFuture,
  getBudgetedThisMonth,
  getFundsForSelectedMonth,
  getOverspentLastMonth,
} from 'inab-shared'
import MonthSelector from '../../MonthSelector'
import {Amount} from '../../Amount'
import './BudgetHeader.scss'

const mapStateToProps = state => ({
  availableToBudget: getAvailableToBudget(state),
  fundsAvailable: getFundsForSelectedMonth(state),
  overspentLastMonth: getOverspentLastMonth(state),
  budgetedThisMonth: getBudgetedThisMonth(state),
  budgetedInFuture: getBudgetedInFuture(state),
})

@connect(mapStateToProps)
export class BudgetHeader extends React.Component {
  static propTypes = {
    availableToBudget: PropTypes.number.isRequired,
    fundsAvailable: PropTypes.number.isRequired,
    overspentLastMonth: PropTypes.number.isRequired,
    budgetedThisMonth: PropTypes.number.isRequired,
    budgetedInFuture: PropTypes.number.isRequired,
  }

  render() {
    return (
      <div className="full-header-container">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="budget-header">
                <MonthSelector />
                <div className="budget-header-amounts">
                  <div className="budget-header-amounts-available">
                    <Amount
                      amount={this.props.availableToBudget}
                      hasBackground
                    />
                    <div>Available to budget</div>
                  </div>

                  <div className="budget-header-amounts-details">
                    <div>
                      <div className="budget-header-amounts-details-amount">
                        <Amount amount={this.props.fundsAvailable} />
                      </div>
                      <div className="budget-header-amounts-details-amount">
                        <Amount amount={this.props.overspentLastMonth} />
                      </div>
                      <div className="budget-header-amounts-details-amount">
                        <Amount amount={this.props.budgetedThisMonth} />
                      </div>
                      <div className="budget-header-amounts-details-amount">
                        <Amount amount={this.props.budgetedInFuture} />
                      </div>
                    </div>
                    <div className="budget-header-amounts-details-names">
                      <div>Funds</div>
                      <div>Overspent last month</div>
                      <div>Budgeted this month</div>
                      <div>Budgeted in the future</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
