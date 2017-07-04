import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import Amount from './Amount';
import ui from 'redux-ui';
import {BudgetItemForm} from './BudgetItemForm';
import FontAwesome from 'react-fontawesome';
import {Link as RouterLink} from 'react-router';
import {CategoryResource, BudgetItemResource, getSelectedMonthMoment} from 'inab-shared';
import {connect} from 'react-redux';

const mapStateToProps = state => ({
  selectedMonth: getSelectedMonthMoment(state)
});

@ui()
@connect(mapStateToProps)
export default class CategoryRow extends React.Component {
  constructor(props) {
    super(props);
    this.editBudgetItem = this.editBudgetItem.bind(this);
    this.clearBudgetItemForm = this.clearBudgetItemForm.bind(this);
  }

  static propTypes = {
    category: CategoryResource.propType,
    activity: PropTypes.number,
    available: PropTypes.number,
    ui: PropTypes.object.isRequired,
    updateUI: PropTypes.func.isRequired,
    budgetItem: BudgetItemResource.propType,
    onNameClick: PropTypes.func,
    selectedMonth: PropTypes.object.isRequired
  };

  editBudgetItem() {
    if (!(this.props.budgetItem && this.props.budgetItem.busy)) {
      this.props.updateUI('editingCategoryId', this.props.category.uuid);
    }
  }

  clearBudgetItemForm() {
    this.props.updateUI('editingCategoryId', null);
  }

  render() {
    let budgetCell;
    if (this.props.ui.editingCategoryId == this.props.category.uuid) {
      budgetCell = (
        <Cell className="right">
          <BudgetItemForm
            category_uuid={this.props.category.uuid}
            postSubmit={this.clearBudgetItemForm}
            updatedResource={this.props.budgetItem}
            onBlur={this.clearBudgetItemForm}
          />
        </Cell>
      );
    } else {
      budgetCell = (
        <Cell className="right" onClick={this.editBudgetItem}>
          {this.props.budgetItem &&
            this.props.budgetItem.busy &&
            <FontAwesome name="refresh" spin fixedWidth />}
          <Amount amount={this.props.budgetItem && this.props.budgetItem.amount} />
        </Cell>
      );
    }

    return (
      <tr>
        <Cell onClick={this.props.onNameClick}>
          {this.props.category.name}
        </Cell>
        {budgetCell}
        <td className="right">
          <RouterLink
            to={`/account/${this.props.selectedMonth.format('YYYY-MM')}/${this.props.category
              .uuid}`}
          >
            <Amount amount={this.props.activity} />
          </RouterLink>
        </td>
        <td className="right">
          <Amount amount={this.props.available} color />
        </td>
      </tr>
    );
  }
}
