import {CategoryResource} from '@inab/shared'
import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {Box} from '../../presentational/atoms/Box'
import {Row} from '../../presentational/atoms/Row'
import {Title} from '../../presentational/atoms/Title'
import {BudgetSidebarGoal} from './BudgetSidebarGoal'

export class BudgetSidebarCategory extends React.Component {
  static propTypes = {
    category: CategoryResource.propTypes,
  }

  render() {
    const {category} = this.props

    return (
      <Fragment>
        <Box>
          <Row>
            <Title>{category.name}</Title>
            <Link to={`/categories/edit/${category.uuid}`}>Edit</Link>
          </Row>
        </Box>

        {category.goal_type && <BudgetSidebarGoal category={category} />}
      </Fragment>
    )
  }
}
