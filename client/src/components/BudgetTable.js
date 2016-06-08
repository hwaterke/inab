'use strict';
import React from 'react';
import { getCategoryGroups } from '../reducers/categoryGroups';
import { getCategories, getCategoriesByGroupId } from '../reducers/categories';
import {connect} from 'react-redux';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import { bindActionCreators } from 'redux';
import CategoryRow from './CategoryRow';
import CategoryGroupRow from './CategoryGroupRow';

class BudgetTable extends React.Component {

  componentDidMount() {
    if (this.props.categoryGroups.length == 0) {
      this.props.categoryGroupsApi.fetch();
    }
    if (this.props.categories.length == 0) {
      this.props.categoriesApi.fetch();
    }
  }

  render() {
    const rows = [];
    this.props.categoryGroups.forEach(cg => {
      rows.push(<CategoryGroupRow key={"cg"+cg.id} name={cg.name} />);
      if (this.props.categoriesByGroupId[cg.id]) {
        this.props.categoriesByGroupId[cg.id].forEach(c => {
          rows.push(<CategoryRow key={"c"+cg.id} name={cg.name} />);
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
  categories: getCategories(state),
  categoriesByGroupId: getCategoriesByGroupId(state)
});
const mapDispatchToProps = (dispatch) => ({
  categoriesApi: bindActionCreators(asyncActionCreatorsFor('categories'), dispatch),
  categoryGroupsApi: bindActionCreators(asyncActionCreatorsFor('category_groups'), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BudgetTable);
