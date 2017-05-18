import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form';
import {BudgetItemResource} from 'inab-shared/src/entities/BudgetItem';
import {connect} from 'react-redux';
import {amountToCents} from 'inab-shared/src/utils/amount';
import {resourceForm} from 'hw-react-shared/src/crud/hoc/resourceForm';
import {crud} from '../hoc/crud';
import {getSelectedMonthMoment} from 'inab-shared/src/selectors/month';

const mapStateToProps = state => ({
  selectedMonth: getSelectedMonthMoment(state)
});

class BudgetItemForm extends React.Component {
  static propTypes = {
    updatedResource: BudgetItemResource.propType,
    category_uuid: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    selectedMonth: PropTypes.object.isRequired
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          name="amount"
          className="form-control"
          onBlur={this.props.onBlur}
          component="input"
          type="text"
          placeholder="Amount"
          autoFocus
        />
      </form>
    );
  }
}

const formToResource = (data, props) => ({
  month: props.selectedMonth.format('YYYY-MM-DD'),
  category_uuid: props.category_uuid,
  amount: amountToCents(data.amount)
});

const resourceToForm = () => ({});

export default connect(mapStateToProps)(
  resourceForm(crud, BudgetItemResource, formToResource, resourceToForm)(BudgetItemForm)
);
