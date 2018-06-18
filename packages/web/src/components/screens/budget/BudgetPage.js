import React, {Fragment} from 'react'
import FontAwesome from 'react-fontawesome'
import {Link} from 'react-router-dom'
import ui from 'redux-ui'
import styled from 'styled-components'
import {Box} from '../../presentational/atoms/Box'
import {Section} from '../../presentational/atoms/Section'
import {BudgetHeader} from './BudgetHeader'
import {BudgetSidebar} from './BudgetSidebar'
import {BudgetTable} from './BudgetTable'

const LinksHeader = styled.div`
  margin-top: 1rem;
  margin-bottom: 1.5rem;

  a:not(:last-child) {
    margin-right: 1rem;
  }
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
      <Fragment>
        <BudgetHeader />

        <Section>
          <div className="columns">
            <div className="column">
              <Box>
                <LinksHeader>
                  <Link to="/category_groups/new">
                    <FontAwesome name="plus" /> Category Group
                  </Link>
                  <Link to="/categories/new">
                    <FontAwesome name="plus" /> Category
                  </Link>
                </LinksHeader>
                <BudgetTable />
              </Box>
            </div>

            <div className="column is-3">
              <BudgetSidebar />
            </div>
          </div>
        </Section>
      </Fragment>
    )
  }
}
