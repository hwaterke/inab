import React from 'react';
import PropTypes from 'prop-types';
import ui from 'redux-ui';
import {connect} from 'react-redux';
import {byIdSelector} from 'hw-react-shared';
import {
  CategoryResource,
  getBudgetedThisMonth,
  getToBeBudgetedSumInSelectedMonth
} from 'inab-shared';
import Amount from '../../Amount';

const mapStateToProps = state => ({
  categoriesById: byIdSelector(CategoryResource)(state),
  budgetedThisMonth: getBudgetedThisMonth(state),
  inflowInCurrentMonth: getToBeBudgetedSumInSelectedMonth(state)
});

@ui()
@connect(mapStateToProps)
export class BudgetSidebar extends React.Component {
  static propTypes = {
    budgetedThisMonth: PropTypes.number.isRequired,
    inflowInCurrentMonth: PropTypes.number.isRequired,
    categoriesById: PropTypes.objectOf(CategoryResource.propType).isRequired,
    selectedCategoryId: PropTypes.string,
    ui: PropTypes.shape({
      categorySelected: PropTypes.string
    }).isRequired,
    updateUI: PropTypes.func.isRequired
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
