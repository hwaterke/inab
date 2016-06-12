import React from 'react';
import BudgetTable from './BudgetTable';
import ui from 'redux-ui';
import MonthSelector from './MonthSelector';
import Amount from './Amount';
import { connect } from "react-redux";
import { getToBeBudgetedSumUpToSelectedMonth } from "../reducers/transactions";
import { getBudgetItemsSum } from "../reducers/budgetItems";

const mapStateToProps = state => ({
  toBeBudgetedSumUpToSelectedMonth: getToBeBudgetedSumUpToSelectedMonth(state),
  budgetItemsSum: getBudgetItemsSum(state)
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
    budgetItemsSum: React.PropTypes.number.isRequired,
    toBeBudgetedSumUpToSelectedMonth: React.PropTypes.number.isRequired
  };

  render() {
    return (
      <div>
        <h1>Budget Page</h1>
        <h3>Available to budget: <Amount amount={this.props.toBeBudgetedSumUpToSelectedMonth - this.props.budgetItemsSum} color /></h3>
        <MonthSelector />
        <BudgetTable />
      </div>
    );
  }
}
