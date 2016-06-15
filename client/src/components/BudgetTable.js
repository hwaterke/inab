import React from 'react';
import { getCategoryGroups } from '../selectors/categoryGroups';
import { getCategoriesByGroupId } from '../selectors/categories';
import { getSelectedMonthBudgetItemsByCategoryId, getBudgetItemsSumUpToSelectedMonthByCategoryId } from '../selectors/budgetItems';
import { getTransactionsSumUpToSelectedMonthByCategoryId, getSelectedMonthActivityByCategoryId } from '../selectors/transactions';
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
    categoriesByGroupId: React.PropTypes.object.isRequired,
    getSelectedMonthActivityByCategoryId: React.PropTypes.object.isRequired,
    getSelectedMonthBudgetItemsByCategoryId: React.PropTypes.object.isRequired,
    transactionsSumUpToSelectedMonthByCategoryId: React.PropTypes.object.isRequired,
    budgetItemsSumUpToSelectedMonthByCategoryId: React.PropTypes.object.isRequired
  }

  render() {
    const rows = [];
    this.props.categoryGroups.forEach(cg => {
      rows.push(<CategoryGroupRow key={"cg"+cg.id} name={cg.name} />);
      if (this.props.categoriesByGroupId[cg.id]) {
        this.props.categoriesByGroupId[cg.id].forEach(c => {
          rows.push(<CategoryRow
            key={"c"+c.id}
            category={c}
            budgetItem={this.props.getSelectedMonthBudgetItemsByCategoryId[c.id]}
            activity={this.props.getSelectedMonthActivityByCategoryId[c.id]}
            available={(this.props.budgetItemsSumUpToSelectedMonthByCategoryId[c.id] || 0) + (this.props.transactionsSumUpToSelectedMonthByCategoryId[c.id] || 0)} />);
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
  transactionsSumUpToSelectedMonthByCategoryId: getTransactionsSumUpToSelectedMonthByCategoryId(state),
  budgetItemsSumUpToSelectedMonthByCategoryId: getBudgetItemsSumUpToSelectedMonthByCategoryId(state)
});

export default connect(mapStateToProps)(BudgetTable);
