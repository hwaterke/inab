import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Link from './Link';
import { getCategories } from '../selectors/categories';
import { getAccounts } from '../selectors/accounts';
import { getPayees } from '../selectors/transactions';
import FontAwesome from 'react-fontawesome';
import ui from 'redux-ui';
import { connect } from 'react-redux';
import DatePickerField from './forms/fields/DatePickerField';
import SimpleSelectField from './forms/fields/SimpleSelectField';
import SimpleSelectCreateField from './forms/fields/SimpleSelectCreateField';

const mapStateToProps = (state) => ({
  accounts: getAccounts(state),
  categories: getCategories(state),
  payees: getPayees(state)
});

@ui()
@connect(mapStateToProps)
@reduxForm({form: 'transaction'})
export default class TransactionRowEditable extends React.Component {
  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,

    onCancel: React.PropTypes.func,

    accounts: React.PropTypes.array.isRequired,
    categories: React.PropTypes.array.isRequired,
    payees: React.PropTypes.array.isRequired,

    showAccount: React.PropTypes.bool.isRequired,
    selectedAccount: React.PropTypes.number.isRequired,

    // Provided by redux-form
    handleSubmit: React.PropTypes.func.isRequired
  };

  render() {
    const categoryOptions = [
      {label: "To be budgeted", value: "tbb"},
      ...this.props.categories.map(c => ({label: c.name, value: c.id}))
    ];
    const payeeOptions = [
      ...this.props.accounts.map(a => ({label: "Tranfer to " + a.name, value: "transfer:" + a.id})),
      ...this.props.payees.map(c => ({label: c, value: c}))
    ];

    return (
      <tr>
        <td>
          { this.props.onCancel && <Link onClick={::this.props.onCancel}><FontAwesome name='ban' /></Link> }
        </td>
        {this.props.showAccount && <td />}
        <td>
          <Field
            name='datee'
            component={DatePickerField} />
        </td>
        <td>
          <Field
            name="payee"
            component={SimpleSelectCreateField}
            placeholder="Payee"
            options={payeeOptions}
            onValueChange={(item) => this.props.updateUI('isTransfer', item && item.value.startsWith("transfer:"))} />
        </td>
        <td>
          <Field
            name="category"
            component={SimpleSelectField}
            placeholder={this.props.ui.isTransfer ? "No category for transfers" : "Category"}
            disabled={this.props.ui.isTransfer}
            options={categoryOptions} />
        </td>
        <td>
          <Field
            name="description"
            component="input"
            className="form-control"
            type="text"
            placeholder="Description" />
        </td>
        <td>
          <Field
            name="amount"
            component="input"
            className="form-control"
            type="text"
            placeholder="Amount" />
        </td>
        <td>
          <Link onClick={this.props.handleSubmit}>
            <FontAwesome name='check' />
          </Link>
        </td>
      </tr>
    );
  }
}
