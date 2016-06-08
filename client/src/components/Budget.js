'use strict';
import React from 'react';
import BudgetTable from './BudgetTable';

export default class BudgetPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Budget Page</h1>
        <BudgetTable />
      </div>
    );
  }
}
