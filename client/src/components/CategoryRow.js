import React from 'react';
import Cell from './Cell';
import Amount from './Amount';
import ui from 'redux-ui';
import BudgetItemForm from './BudgetItemForm';
import FontAwesome from 'react-fontawesome';
import {Link as RouterLink} from 'react-router';
import {CategoryResource} from 'inab-shared/src/entities/Category';
import {BudgetItemResource} from 'inab-shared/src/entities/BudgetItem';
import {connect} from 'react-redux';
import {getCurrentMonth} from '../selectors/ui';

const mapStateToProps = state => ({
  selectedMonth: getCurrentMonth(state)
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
    activity: React.PropTypes.number,
    available: React.PropTypes.number,
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
    budgetItem: BudgetItemResource.propType,
    onNameClick: React.PropTypes.func,
    selectedMonth: React.PropTypes.object.isRequired
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
            postSubmit={() => this.props.updateUI('editingCategoryId', null)}
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
        <Cell onClick={this.props.onNameClick}>{this.props.category.name}</Cell>
        {budgetCell}
        <td className="right">
          <RouterLink
            to={`/account/${this.props.selectedMonth.format('YYYY-MM')}/${this.props.category.uuid}`}
          >
            <Amount amount={this.props.activity} />
          </RouterLink>
        </td>
        <td className="right"><Amount amount={this.props.available} color /></td>
      </tr>
    );
  }
}
