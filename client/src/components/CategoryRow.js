import React from 'react';
import Cell from './Cell';
import Amount from './Amount';
import ui from 'redux-ui';
import BudgetItemForm from './BudgetItemForm';
import {connect} from 'react-redux';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';
import {amountToCents} from '../utils/amount';
import {Link as RouterLink} from 'react-router';
import {BudgetItemResource} from '../entities/BudgetItem';

@ui()
class CategoryRow extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.editBudgetItem = this.editBudgetItem.bind(this);
    this.clearBudgetItemForm = this.clearBudgetItemForm.bind(this);
  }

  static propTypes = {
    category: React.PropTypes.object.isRequired,
    activity: React.PropTypes.number,
    available: React.PropTypes.number,
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
    create: React.PropTypes.func.isRequired,
    update: React.PropTypes.func.isRequired,
    budgetItem: React.PropTypes.object,
    onNameClick: React.PropTypes.func
  };

  editBudgetItem() {
    if (!(this.props.budgetItem && this.props.budgetItem.busy)) {
      this.props.updateUI('editingCategoryId', this.props.category.id);
    }
  }

  clearBudgetItemForm() {
    this.props.updateUI('editingCategoryId', null);
  }

  getSelectedMonthMoment() {
    return moment([this.props.ui.year, this.props.ui.month - 1]);
  }

  onSubmit(data) {
    const m = this.getSelectedMonthMoment().format('YYYY-MM-DD');
    if (this.props.budgetItem) {
      this.props.update({
        id: this.props.budgetItem.id,
        month: m,
        category_id: this.props.category.id,
        amount: amountToCents(data.amount)
      });
    } else {
      this.props.create({
        month: m,
        category_id: this.props.category.id,
        amount: amountToCents(data.amount)
      });
    }
    this.props.updateUI('editingCategoryId', null);
  }

  render() {
    let budgetCell;
    if (this.props.ui.editingCategoryId == this.props.category.id) {
      budgetCell =
        <Cell className="right">
          <BudgetItemForm onBlur={this.clearBudgetItemForm} onSubmit={this.onSubmit} />
        </Cell>;
    } else {
      budgetCell =
        <Cell className="right" onClick={this.editBudgetItem}>
          {this.props.budgetItem && this.props.budgetItem.busy && <FontAwesome name="refresh" spin fixedWidth />}
          <Amount amount={this.props.budgetItem && this.props.budgetItem.amount} />
        </Cell>;
    }

    return (
      <tr>
        <Cell onClick={this.props.onNameClick}>{this.props.category.name}</Cell>
        {budgetCell}
        <td className="right">
          <RouterLink to={`/account/${this.getSelectedMonthMoment().format('YYYY-MM')}/${this.props.category.id}`}>
            <Amount amount={this.props.activity} />
          </RouterLink>
        </td>
        <td className="right"><Amount amount={this.props.available} color /></td>
      </tr>
    );
  }
}

export default connect(null, asyncActionCreatorsFor(BudgetItemResource.path))(CategoryRow);
