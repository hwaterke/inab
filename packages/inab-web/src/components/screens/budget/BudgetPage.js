import React from 'react'
import FontAwesome from 'react-fontawesome'
import {Link} from 'react-router-dom'
import ui from 'redux-ui'
import {Box} from '../../presentational/atoms/Box'
import {BudgetHeader} from './BudgetHeader'
import {BudgetSidebar} from './BudgetSidebar'
import {BudgetTable} from './BudgetTable'

const Container = Box.extend`
  margin: 0;
  padding: 0;
  border-top: 0;
  border-left: 0;
  border-radius: 0;
`

@ui({
  state: {
    categoryGroupFormOpen: false,
    categoryGroupSelected: null,
    categoryFormOpen: false,
    categorySelected: null,
  },
})
export class BudgetPage extends React.Component {
  render() {
    return (
      <div>
        <BudgetHeader />

        <div className="container-fluid">
          <div className="row">
            <Container className="col-md-8">
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
            </Container>

            <div className="col-md-4">
              <BudgetSidebar />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
