'use strict';
import React from 'react';
import { getCategoryGroups } from '../reducers/categoryGroups';
import { getCategoryCount, getCategoriesByGroupId } from '../reducers/categories';
import { getSelectedMonthActivityByCategoryId } from '../reducers/categories';
import { getSelectedMonthBudgetItemsByCategoryId } from '../reducers/budgetItems';
import {connect} from 'react-redux';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import { bindActionCreators } from 'redux';
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
    categoryCount: React.PropTypes.number.isRequired,
    categoriesByGroupId: React.PropTypes.object.isRequired,
    categoriesApi: React.PropTypes.object.isRequired,
    categoryGroupsApi: React.PropTypes.object.isRequired,
    getSelectedMonthActivityByCategoryId: React.PropTypes.object.isRequired,
    getSelectedMonthBudgetItemsByCategoryId: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    if (this.props.categoryGroups.length == 0) {
      this.props.categoryGroupsApi.fetch();
    }
    if (this.props.categoryCount == 0) {
      this.props.categoriesApi.fetch();
    }
  }

  render() {
    const rows = [];
    this.props.categoryGroups.forEach(cg => {
      rows.push(<CategoryGroupRow key={"cg"+cg.id} name={cg.name} />);
      if (this.props.categoriesByGroupId[cg.id]) {
        this.props.categoriesByGroupId[cg.id].forEach(c => {
          rows.push(<CategoryRow key={"c"+c.id} category={c} budgetItem={this.props.getSelectedMonthBudgetItemsByCategoryId[c.id]} activity={this.props.getSelectedMonthActivityByCategoryId[c.id]} />);
        });
      }
    });

    return (
      <table className="table table-striped">
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
  categoryCount: getCategoryCount(state),
  categoriesByGroupId: getCategoriesByGroupId(state),
  getSelectedMonthActivityByCategoryId: getSelectedMonthActivityByCategoryId(state),
  getSelectedMonthBudgetItemsByCategoryId: getSelectedMonthBudgetItemsByCategoryId(state)
});
const mapDispatchToProps = (dispatch) => ({
  categoriesApi: bindActionCreators(asyncActionCreatorsFor('categories'), dispatch),
  categoryGroupsApi: bindActionCreators(asyncActionCreatorsFor('category_groups'), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BudgetTable);
