import {
  BudgetItemResource,
  CategoryResource,
  getSelectedMonthMoment,
} from 'inab-shared'
import PropTypes from 'prop-types'
import {path} from 'ramda'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import {connect} from 'react-redux'
import {Link as RouterLink} from 'react-router-dom'
import ui from 'redux-ui'
import {Amount} from './Amount'
import {BudgetItemFormContainer} from './BudgetItemFormContainer'
import Cell from './Cell'

const mapStateToProps = state => ({
  selectedMonth: getSelectedMonthMoment(state),
})

@ui()
@connect(mapStateToProps)
export class CategoryRow extends React.Component {
  static propTypes = {
    category: CategoryResource.propTypes,
    activity: PropTypes.number,
    available: PropTypes.number,
    ui: PropTypes.object.isRequired,
    updateUI: PropTypes.func.isRequired,
    budgetItem: BudgetItemResource.propTypes,
    onNameClick: PropTypes.func,
    selectedMonth: PropTypes.object.isRequired,
    goal: PropTypes.bool.isRequired,
  }

  editBudgetItem = () => {
    if (!(this.props.budgetItem && this.props.budgetItem.busy)) {
      this.props.updateUI('editingCategoryId', this.props.category.uuid)
    }
  }

  clearBudgetItemForm = () => {
    this.props.updateUI('editingCategoryId', null)
  }

  render() {
    const {budgetItem} = this.props

    let budgetCell
    if (this.props.ui.editingCategoryId === this.props.category.uuid) {
      budgetCell = (
        <Cell className="right">
          <BudgetItemFormContainer
            uuid={path(['uuid'], budgetItem)}
            category_uuid={this.props.category.uuid}
            postSubmit={this.clearBudgetItemForm}
            onBlur={this.clearBudgetItemForm}
          />
        </Cell>
      )
    } else {
      budgetCell = (
        <Cell className="right" onClick={this.editBudgetItem}>
          {this.props.budgetItem &&
            this.props.budgetItem.busy && (
              <FontAwesome name="refresh" spin fixedWidth />
            )}
          <Amount
            amount={this.props.budgetItem && this.props.budgetItem.amount}
          />
        </Cell>
      )
    }

    return (
      <tr>
        <Cell onClick={this.props.onNameClick}>{this.props.category.name}</Cell>
        {budgetCell}
        <td className="right">
          <RouterLink
            to={`/account/${this.props.selectedMonth.format('YYYY-MM')}/${
              this.props.category.uuid
            }`}
          >
            <Amount amount={this.props.activity} />
          </RouterLink>
        </td>
        <td className="right">
          <Amount
            amount={this.props.available}
            hasBackground
            isGoal={this.props.goal}
          />
        </td>
      </tr>
    )
  }
}
