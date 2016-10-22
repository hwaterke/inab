import React from 'react';
import BudgetTable from './BudgetTable';
import ui from 'redux-ui';
import Amount from './Amount';
import CategoryGroupFormDialog from './forms/CategoryGroupFormDialog';
import CategoryFormDialog from './forms/CategoryFormDialog';
import MonthSelector from './MonthSelector';
import { connect } from "react-redux";
import { getAvailableToBudget, getFundsForSelectedMonth, getOverspentLastMonth, getBudgetedThisMonth, getBudgetedInFuture } from "../selectors/budget";

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
        <h1>Budget Page</h1>
        <h3>Available to budget: <Amount amount={this.props.availableToBudget} color /></h3>
        <ul>
          <li><Amount amount={this.props.fundsAvailable} color /> Funds</li>
          <li><Amount amount={this.props.overspentLastMonth} color /> Overspent last month</li>
          <li><Amount amount={this.props.budgetedThisMonth} color /> Budgeted this month</li>
          <li><Amount amount={this.props.budgetedInFuture} color /> Budgeted in the future</li>
        </ul>
        <div>
          <CategoryGroupFormDialog />
          <CategoryFormDialog />
          <MonthSelector />
        </div>
        <BudgetTable />
      </div>
    );
  }
}
