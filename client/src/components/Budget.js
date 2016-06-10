import React from 'react';
import BudgetTable from './BudgetTable';
import ui from 'redux-ui';
import MonthSelector from './MonthSelector';

@ui({
  key: 'budget',
  persist: true,
  state: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  }
})
export default class BudgetPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Budget Page</h1>
        <MonthSelector />
        <BudgetTable />
      </div>
    );
  }
}
