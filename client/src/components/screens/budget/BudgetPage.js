import React from 'react';
import {Link} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import ui from 'redux-ui';
import {BudgetTable} from './BudgetTable';
import {BudgetHeader} from './BudgetHeader';
import {BudgetSidebar} from './BudgetSidebar';
import './BudgetPage.scss';

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
            <div className="col-md-8 budget-page-table-container">
              <div className="mt-4 pb-4">
                <div className="my-4">
                  <Link to="/category_groups/new">
                    <FontAwesome name="plus" fixedWidth /> Category Group
                  </Link>
                  <Link to="/categories/new">
                    <FontAwesome name="plus" fixedWidth /> Category
                  </Link>
                </div>
                <BudgetTable />
              </div>
            </div>

            <div className="col-md-4">
              <BudgetSidebar />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
