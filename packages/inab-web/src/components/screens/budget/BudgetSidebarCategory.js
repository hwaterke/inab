import {CategoryResource} from 'inab-shared'
import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Box} from '../../presentational/atoms/Box'
import {BudgetSidebarGoal} from './BudgetSidebarGoal'

export class BudgetSidebarCategory extends React.Component {
  static propTypes = {
    category: CategoryResource.propTypes,
  }

  render() {
    const {category} = this.props

    return (
      <Fragment>
        <Box className="d-flex justify-content-between">
          <h4>{category.name}</h4>

          <Link to={`/categories/edit/${category.uuid}`}>Edit</Link>
        </Box>

        {category.goal_type && <BudgetSidebarGoal category={category} />}
      </Fragment>
    )
  }
}
