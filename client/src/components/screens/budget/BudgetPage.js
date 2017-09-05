import React from 'react';
import {BudgetTable} from '../../BudgetTable';
import ui from 'redux-ui';
import CategoryGroupFormDialog from '../../forms/CategoryGroupFormDialog';
import CategoryFormDialog from '../../forms/CategoryFormDialog';
import {BudgetHeader} from './BudgetHeader';

@ui({
  state: {
    categoryGroupFormOpen: false,
    categoryGroupSelected: null,
    categoryFormOpen: false,
    categorySelected: null
  }
})
export class BudgetPage extends React.Component {
  render() {
    return (
      <div>
        <BudgetHeader />
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
