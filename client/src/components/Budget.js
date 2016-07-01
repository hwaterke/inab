import React from 'react';
import BudgetTable from './BudgetTable';
import ui from 'redux-ui';
import MonthSelector from './MonthSelector';
import Amount from './Amount';
import { connect } from "react-redux";
import { getAvailableToBudget, getFundsForSelectedMonth } from "../selectors/budget";

const mapStateToProps = state => ({
  availableToBudget: getAvailableToBudget(state),
  fundsAvailable: getFundsForSelectedMonth(state)
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
    fundsAvailable: React.PropTypes.number.isRequired
  };

  render() {
    return (
      <div>
        <h1>Budget Page</h1>
        <h3>Available to budget: <Amount amount={this.props.availableToBudget} color /></h3>
        <p>Funds: <Amount amount={this.props.fundsAvailable} color /></p>
        <MonthSelector />
        <BudgetTable />
      </div>
    );
  }
}
