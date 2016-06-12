import React from 'react';
import Cell from './Cell';
import Amount from './Amount';
import ui from 'redux-ui';
import BudgetItemForm from './BudgetItemForm';
import {connect} from 'react-redux';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';

@ui()
class CategoryRow extends React.Component {
  static propTypes = {
    category: React.PropTypes.object.isRequired,
    activity: React.PropTypes.number,
    ui: React.PropTypes.object,
    updateUI: React.PropTypes.func,
    create: React.PropTypes.func.isRequired,
    update: React.PropTypes.func.isRequired,
    budgetItem: React.PropTypes.object
  }

  editBudgetItem() {
    if ( !(this.props.budgetItem && this.props.budgetItem.busy) ) {
      this.props.updateUI('editingCategoryId', this.props.category.id);
    }
  }

  render() {
    var budgetCell;
    // TODO this is way too much logic for a component. This should be moved somwhere else.
    if (this.props.ui.editingCategoryId == this.props.category.id) {
      const onSubmit = (data) => {
        const m = moment([this.props.ui.year, this.props.ui.month]);
        if (this.props.budgetItem) {
          this.props.update({
            id: this.props.budgetItem.id,
            month: m.format("YYYY-MM-DD"),
            category_id: this.props.category.id,
            amount: data.amount
          });
        } else {
          this.props.create({
            month: m.format("YYYY-MM-DD"),
            category_id: this.props.category.id,
            amount: data.amount
          });
        }
        this.props.updateUI('editingCategoryId', undefined);
      };

      budgetCell = <Cell><BudgetItemForm onSubmit={onSubmit.bind(this)} /></Cell>;
    } else {
      budgetCell = <Cell onClick={() => this.editBudgetItem()}>{this.props.budgetItem && this.props.budgetItem.busy && <FontAwesome name='refresh' spin fixedWidth />}{this.props.budgetItem && this.props.budgetItem.amount}</Cell>;
    }

    return (
      <tr>
        <Cell>{this.props.category.name}</Cell>
        {budgetCell}
        <td><Amount amount={this.props.activity} /></td>
        <td />
      </tr>
    );
  }
}

export default connect(null, asyncActionCreatorsFor('budget_items'))(CategoryRow);
