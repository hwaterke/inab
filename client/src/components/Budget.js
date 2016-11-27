import React from 'react';
import BudgetTable from './BudgetTable';
import ui from 'redux-ui';
import Amount from './Amount';
import CategoryGroupFormDialog from './forms/CategoryGroupFormDialog';
import CategoryFormDialog from './forms/CategoryFormDialog';
import MonthSelector from './MonthSelector';
import { connect } from "react-redux";
import { getAvailableToBudget, getFundsForSelectedMonth, getOverspentLastMonth, getBudgetedThisMonth, getBudgetedInFuture } from "../selectors/budget";
import '../styles/budget-header.scss';

const mapStateToProps = state => ({
  availableToBudget: getAvailableToBudget(state),
  fundsAvailable: getFundsForSelectedMonth(state),
  overspentLastMonth: getOverspentLastMonth(state),
  budgetedThisMonth: getBudgetedThisMonth(state),
  budgetedInFuture: getBudgetedInFuture(state)
});

@ui({
  key: 'budget',
  persist: true,
  state: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    categoryGroupFormOpen: false,
    categoryGroupSelected: null,
    categoryFormOpen: false,
    categorySelected: null
  }
})
@connect(mapStateToProps)
export default class BudgetPage extends React.Component {
  static propTypes = {
    availableToBudget: React.PropTypes.number.isRequired,
    fundsAvailable: React.PropTypes.number.isRequired,
    overspentLastMonth: React.PropTypes.number.isRequired,
    budgetedThisMonth: React.PropTypes.number.isRequired,
    budgetedInFuture: React.PropTypes.number.isRequired
  };

  render() {
    return (
      <div>
        <div className="budget-header col-md-12">
          <MonthSelector />
          <div className="budget-header-amounts">
            <div>
              <h2><Amount amount={this.props.availableToBudget} color /></h2>
              <p>Available to budget</p>
            </div>

            <div className="budget-header-amounts-details">
              <div>
                <div className="budget-header-amounts-details-amount"><Amount amount={this.props.fundsAvailable} /></div>
                <div className="budget-header-amounts-details-amount"><Amount amount={this.props.overspentLastMonth} /></div>
                <div className="budget-header-amounts-details-amount"><Amount amount={this.props.budgetedThisMonth} /></div>
                <div className="budget-header-amounts-details-amount"><Amount amount={this.props.budgetedInFuture} /></div>
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
        <div className="col-md-12">
          <CategoryGroupFormDialog />
          <CategoryFormDialog />
          <BudgetTable />
        </div>
      </div>
    );
  }
}
