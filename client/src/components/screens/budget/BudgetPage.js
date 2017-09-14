import React from 'react';
import {BudgetTable} from './BudgetTable';
import ui from 'redux-ui';
import {BudgetHeader} from './BudgetHeader';
import './BudgetPage.scss';
import {CategoryGroupFormDialog} from '../../forms/CategoryGroupFormDialog';
import {CategoryFormDialog} from '../../forms/CategoryFormDialog';
import {BudgetSidebar} from './BudgetSidebar';

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

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8">
              <div className="mt-4 pb-4 box">
                <div className="my-4">
                  <CategoryGroupFormDialog />
                  <CategoryFormDialog />
                </div>
                <BudgetTable />
              </div>
            </div>

            <div className="col-md-4">
              <div className="mt-4 p-4 box">
                <BudgetSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
