import React from 'react';
import { getCategoryGroups } from '../selectors/categoryGroups';
import { getCategoriesByGroupId } from '../selectors/categories';
import { getAvailableByCategoryIdForSelectedMonth } from '../selectors/budget';
import { getSelectedMonthBudgetItemsByCategoryId } from '../selectors/budgetItems';
import { getSelectedMonthActivityByCategoryId } from '../selectors/transactions';
import {connect} from 'react-redux';
import CategoryRow from './CategoryRow';
import CategoryGroupRow from './CategoryGroupRow';
import ui from 'redux-ui';

@ui({
  state: {
    editingCategoryId: undefined
  }
})
class BudgetTable extends React.Component {
  static propTypes = {
    categoryGroups: React.PropTypes.array.isRequired,
    categoriesByGroupId: React.PropTypes.instanceOf(Map).isRequired,
    getSelectedMonthActivityByCategoryId: React.PropTypes.instanceOf(Map).isRequired,
    getSelectedMonthBudgetItemsByCategoryId: React.PropTypes.instanceOf(Map).isRequired,
    availableByCategory: React.PropTypes.instanceOf(Map).isRequired
  }

  render() {
    const rows = [];
    this.props.categoryGroups.forEach(cg => {
      rows.push(<CategoryGroupRow
        key={"cg"+cg.id}
        categoryGroup={cg}
        onClick={() => this.props.updateUI({categoryGroupSelected: cg.id, formOpen: true})} />);
      if (this.props.categoriesByGroupId.get(cg.id)) {
        this.props.categoriesByGroupId.get(cg.id).forEach(c => {
          rows.push(<CategoryRow
            key={"c"+c.id}
            category={c}
            budgetItem={this.props.getSelectedMonthBudgetItemsByCategoryId.get(c.id)}
            activity={this.props.getSelectedMonthActivityByCategoryId.get(c.id)}
            available={this.props.availableByCategory.get(c.id)} />);
        });
      }
    });

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Budgeted</th>
            <th>Activity</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => ({
  categoryGroups: getCategoryGroups(state),
  categoriesByGroupId: getCategoriesByGroupId(state),
  getSelectedMonthActivityByCategoryId: getSelectedMonthActivityByCategoryId(state),
  getSelectedMonthBudgetItemsByCategoryId: getSelectedMonthBudgetItemsByCategoryId(state),
  availableByCategory: getAvailableByCategoryIdForSelectedMonth(state)
});

export default connect(mapStateToProps)(BudgetTable);
