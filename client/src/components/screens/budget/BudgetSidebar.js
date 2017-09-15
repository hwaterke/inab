import React from 'react';
import PropTypes from 'prop-types';
import ui from 'redux-ui';
import {connect} from 'react-redux';
import {arraySelector, byIdSelector} from 'hw-react-shared';
import {
  BudgetItemResource,
  CategoryResource,
  getAvailableByCategoryIdForSelectedMonth,
  getAvailableToBudget,
  getBudgetedThisMonth,
  getSelectedMonthBudgetItemByCategoryId,
  getSelectedMonthMoment,
  getToBeBudgetedSumInSelectedMonth
} from 'inab-shared';
import Amount from '../../Amount';
import {crud} from '../../../hoc/crud';

const mapStateToProps = state => ({
  categories: arraySelector(CategoryResource)(state),
  categoriesById: byIdSelector(CategoryResource)(state),
  availableToBudget: getAvailableToBudget(state),
  availableByCategory: getAvailableByCategoryIdForSelectedMonth(state),
  selectedMonth: getSelectedMonthMoment(state),
  selectedMonthBudgetItemByCategoryId: getSelectedMonthBudgetItemByCategoryId(state),
  budgetedThisMonth: getBudgetedThisMonth(state),
  inflowInCurrentMonth: getToBeBudgetedSumInSelectedMonth(state)
});

@crud
@ui()
@connect(mapStateToProps)
export class BudgetSidebar extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(CategoryResource.propType).isRequired,
    categoriesById: PropTypes.objectOf(CategoryResource.propType).isRequired,
    availableToBudget: PropTypes.number.isRequired,
    availableByCategory: PropTypes.instanceOf(Map).isRequired,
    selectedMonth: PropTypes.object.isRequired,
    selectedMonthBudgetItemByCategoryId: PropTypes.objectOf(BudgetItemResource.propType).isRequired,
    budgetedThisMonth: PropTypes.number.isRequired,
    inflowInCurrentMonth: PropTypes.number.isRequired,
    selectedCategoryId: PropTypes.string,
    createResource: PropTypes.func.isRequired,
    updateResource: PropTypes.func.isRequired,
    ui: PropTypes.shape({
      categorySelected: PropTypes.string
    }).isRequired,
    updateUI: PropTypes.func.isRequired
  };

  /**
   * Adds the specified amount to the category
   */
  budgetCategoryAdd = (categoryUuid, amount) => {
    const existingBudgetItem = this.props.selectedMonthBudgetItemByCategoryId[categoryUuid];

    if (existingBudgetItem) {
      // Update
      return this.props.updateResource(BudgetItemResource, {
        ...existingBudgetItem,
        amount: amount + existingBudgetItem.amount
      });
    } else {
      // Create
      return this.props.createResource(BudgetItemResource, {
        month: this.props.selectedMonth.format('YYYY-MM-DD'),
        category_uuid: categoryUuid,
        amount
      });
    }
  };

  quickBudgetUnderfunded = async () => {
    let availableToBudget = this.props.availableToBudget;

    for (let category of this.props.categories) {
      const available = this.props.availableByCategory.get(category.uuid);
      if (available < 0) {
        const adding = Math.min(-available, availableToBudget);
        if (adding > 0) {
          await this.budgetCategoryAdd(category.uuid, adding);
          availableToBudget -= adding;
        }
      }
    }
  };

  render() {
    const {ui: {categorySelected}, updateUI, categoriesById} = this.props;

    if (!categorySelected) {
      return (
        <div>
          <div className="d-flex flex-column align-items-center mb-4">
            <h4>Total budgeted</h4>
            <h2>
              <Amount amount={-this.props.budgetedThisMonth} />
            </h2>
          </div>

          <div className=" d-flex flex-column align-items-center mb-4">
            <h4>Total inflows</h4>
            <h2>
              <Amount amount={this.props.inflowInCurrentMonth} />
            </h2>
          </div>

          <button onClick={this.quickBudgetUnderfunded} className="btn btn-primary">
            Quick budget underfunded
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="d-flex justify-content-between">
          <h4>
            {categoriesById[categorySelected].name}
          </h4>

          <button onClick={() => updateUI({categoryFormOpen: true})} className="btn btn-primary">
            Edit
          </button>
        </div>
      </div>
    );
  }
}
