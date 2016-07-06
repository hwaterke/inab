import React from 'react';
import BudgetTable from './BudgetTable';
import ui from 'redux-ui';
import MonthSelector from './MonthSelector';
import Amount from './Amount';
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
    month: new Date().getMonth() + 1
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
        <MonthSelector />
        <BudgetTable />
      </div>
    );
  }
}
