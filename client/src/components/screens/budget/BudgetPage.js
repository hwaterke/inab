import React from 'react';
import PropTypes from 'prop-types';
import {BudgetTable} from '../../BudgetTable';
import ui from 'redux-ui';
import Amount from '../../Amount';
import CategoryGroupFormDialog from '../../forms/CategoryGroupFormDialog';
import CategoryFormDialog from '../../forms/CategoryFormDialog';
import MonthSelector from '../../MonthSelector';
import {connect} from 'react-redux';
import '../../Budget.scss';
import {
  getAvailableToBudget,
  getFundsForSelectedMonth,
  getOverspentLastMonth,
  getBudgetedThisMonth,
  getBudgetedInFuture
} from 'inab-shared';

const mapStateToProps = state => ({
  availableToBudget: getAvailableToBudget(state),
  fundsAvailable: getFundsForSelectedMonth(state),
  overspentLastMonth: getOverspentLastMonth(state),
  budgetedThisMonth: getBudgetedThisMonth(state),
  budgetedInFuture: getBudgetedInFuture(state)
});

@ui({
  state: {
    categoryGroupFormOpen: false,
    categoryGroupSelected: null,
    categoryFormOpen: false,
    categorySelected: null
  }
})
@connect(mapStateToProps)
export class BudgetPage extends React.Component {
  static propTypes = {
    availableToBudget: PropTypes.number.isRequired,
    fundsAvailable: PropTypes.number.isRequired,
    overspentLastMonth: PropTypes.number.isRequired,
    budgetedThisMonth: PropTypes.number.isRequired,
    budgetedInFuture: PropTypes.number.isRequired
  };

  render() {
    return (
      <div>
        <div className="budget-header">
          <MonthSelector />
          <div className="budget-header-amounts">
            <div className="budget-header-amounts-available">
              <Amount amount={this.props.availableToBudget} color />
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
        <div>
          <div className="box-container">
            <CategoryGroupFormDialog />
            <CategoryFormDialog />
          </div>
          <div className="box-container">
            <BudgetTable />
          </div>
        </div>
      </div>
    );
  }
}
