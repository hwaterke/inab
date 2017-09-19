import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {CategoryRow} from '../../CategoryRow';
import CategoryGroupRow from '../../CategoryGroupRow';
import ui from 'redux-ui';
import '../../../styles/tables.scss';
import {
  CategoryGroupResource,
  CategoryResource,
  getSortedCategoryGroups,
  selectCategoriesByGroupId,
  getSelectedMonthBudgetItemByCategoryId,
  BudgetItemResource,
  selectSelectedMonthActivityByCategoryId,
  getAvailableByCategoryIdForSelectedMonth,
  goalToBudgetByCategoryForSelectedMonth
} from 'inab-shared';
import {withRouter} from 'react-router-dom';

const mapStateToProps = state => ({
  categoryGroups: getSortedCategoryGroups(state),
  categoriesByGroupId: selectCategoriesByGroupId(state),
  selectedMonthActivityByCategoryId: selectSelectedMonthActivityByCategoryId(state),
  selectedMonthBudgetItemByCategoryId: getSelectedMonthBudgetItemByCategoryId(state),
  availableByCategory: getAvailableByCategoryIdForSelectedMonth(state),
  goalToBudgetByCategoryForSelectedMonth: goalToBudgetByCategoryForSelectedMonth(state)
});

@ui({
  state: {
    editingCategoryId: undefined
  }
})
@connect(mapStateToProps)
@withRouter
export class BudgetTable extends React.Component {
  static propTypes = {
    categoryGroups: PropTypes.arrayOf(CategoryGroupResource.propType).isRequired,
    categoriesByGroupId: PropTypes.objectOf(PropTypes.arrayOf(CategoryResource.propType).isRequired)
      .isRequired,
    selectedMonthActivityByCategoryId: PropTypes.objectOf(PropTypes.number.isRequired).isRequired,
    selectedMonthBudgetItemByCategoryId: PropTypes.objectOf(BudgetItemResource.propType).isRequired,
    availableByCategory: PropTypes.instanceOf(Map).isRequired,
    goalToBudgetByCategoryForSelectedMonth: PropTypes.objectOf(PropTypes.number).isRequired,
    ui: PropTypes.shape({
      categorySelected: PropTypes.string
    }).isRequired,
    updateUI: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  categoryNameClick = categoryUuid => () => {
    if (this.props.ui.categorySelected === categoryUuid) {
      this.props.updateUI({categorySelected: null});
    } else {
      this.props.updateUI({categorySelected: categoryUuid});
    }
  };

  render() {
    const rows = [];
    this.props.categoryGroups.forEach(cg => {
      rows.push(
        <CategoryGroupRow
          key={'cg' + cg.uuid}
          categoryGroup={cg}
          onClick={() => this.props.history.push(`/category_groups/edit/${cg.uuid}`)}
        />
      );
      if (this.props.categoriesByGroupId[cg.uuid]) {
        this.props.categoriesByGroupId[cg.uuid].forEach(c => {
          rows.push(
            <CategoryRow
              key={'c' + c.uuid}
              category={c}
              onNameClick={this.categoryNameClick(c.uuid)}
              budgetItem={this.props.selectedMonthBudgetItemByCategoryId[c.uuid]}
              activity={this.props.selectedMonthActivityByCategoryId[c.uuid]}
              available={this.props.availableByCategory.get(c.uuid)}
              goal={!!this.props.goalToBudgetByCategoryForSelectedMonth[c.uuid]}
            />
          );
        });
      }
    });

    return (
      <table className="table table-sm table-hover budget-table">
        <thead>
          <tr>
            <th>Category</th>
            <th className="right">Budgeted</th>
            <th className="right">Activity</th>
            <th className="right">Available</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}
