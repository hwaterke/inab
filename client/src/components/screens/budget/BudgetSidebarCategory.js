import React from 'react';
import {CategoryResource} from 'inab-shared';
import {Link} from 'react-router-dom';
import {BudgetSidebarGoal} from './BudgetSidebarGoal';

export class BudgetSidebarCategory extends React.Component {
  static propTypes = {
    category: CategoryResource.propType
  };

  render() {
    const {category} = this.props;

    return (
      <div>
        <div className="d-flex justify-content-between mt-3 p-4 box">
          <h4>{category.name}</h4>

          <Link to={`/categories/edit/${category.uuid}`}>Edit</Link>
        </div>

        {category.goal_type && <BudgetSidebarGoal category={category} />}
      </div>
    );
  }
}
