import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import asyncActionCreatorsFor from '../../actions/asyncActionCreatorsFor';
import { connect } from 'react-redux';
import { getCategories } from '../../selectors/categories';
import { getAccounts } from '../../selectors/accounts';
import { getPayees } from '../../selectors/transactions';
import DatePickerField from './fields/DatePickerField';
import SimpleSelectField from './fields/SimpleSelectField';
import SimpleSelectCreateField from './fields/SimpleSelectCreateField';
import moment from 'moment';
import ButtonCheck from '../ButtonCheck';
import Link from '../Link';
import FontAwesome from 'react-fontawesome';

const selector = formValueSelector('transactionNew');

const mapStateToProps = (state) => ({
  accounts: getAccounts(state),
  categories: getCategories(state),
  payees: getPayees(state),
  payeeValue: selector(state, 'payee')
});

@connect(
  mapStateToProps,
  asyncActionCreatorsFor('transactions'),
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, dispatchProps, (ownProps.transaction != null) ? {
      initialValues: {
        account_id: ownProps.transaction.account_id,
        date: ownProps.transaction.date,
        payee: ownProps.transaction.transfer_account_id ? "transfer:" + ownProps.transaction.transfer_account_id : ownProps.transaction.payee,
        category: ownProps.transaction.type == 'to_be_budgeted' ? 'tbb' : ownProps.transaction.category_id,
        description: ownProps.transaction.description,
        amount: ownProps.transaction.amount / 100
      }
    } : {
      initialValues: {
        account_id: ownProps.selectedAccountId,
        date: moment().format("YYYY-MM-DD")
      }
    })
)
@reduxForm({form: 'transactionNew', enableReinitialize: true})
class TransactionForm extends React.Component {
  constructor(props) {
    super(props);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    // Action creators
    create: React.PropTypes.func.isRequired,
    update: React.PropTypes.func.isRequired,
    delete: React.PropTypes.func.isRequired,

    // Reference data
    accounts: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired
      })
    ).isRequired,
    categories: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired
      })
    ).isRequired,
    payees: React.PropTypes.arrayOf(
      React.PropTypes.string
    ).isRequired,

    payeeValue: React.PropTypes.string,

    transaction: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired
    }),
    postSubmit: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    showAccount: React.PropTypes.bool.isRequired,

    handleSubmit: React.PropTypes.func.isRequired
  };

  create(data) {
    this.props.create({
      date: data.date,
      transfer_account_id: data.transfer_account_id,
      payee: data.payee,
      account_id: data.account_id,
      category_id: (data.category != 'tbb' ? data.category : null),
      description: data.description,
      amount: Math.round(Number(data.amount) * 100),
      subtransactions: [],
      type: data.type
    });
  }

  update(data) {
    this.props.update({
      id: this.props.transaction.id,
      date: data.date,
      transfer_account_id: data.transfer_account_id,
      payee: data.payee,
      account_id: data.account_id,
      category_id: (data.category != 'tbb' ? data.category : null),
      description: data.description,
      amount: Math.round(Number(data.amount) * 100),
      subtransactions: [],
      type: data.type
    });
  }

  delete() {
    this.props.delete({
      id: this.props.transaction.id
    });
    if (this.props.postSubmit != null) {
      this.props.postSubmit();
    }
  }

  onSubmit(data) {
    // Lets work on a copy of the form data
    data = Object.assign({}, data);

    // Compute the type of transaction
    data.type = 'regular';
    if (data.category == 'tbb') {
      data.type = 'to_be_budgeted';
    }

    // Compute the transfer_account_id
    data.transfer_account_id = null;
    if (data.payee && data.payee.startsWith("transfer:")) {
      data.transfer_account_id = parseInt(data.payee.slice("transfer:".length));
      data.payee = null;
    }

    if (this.props.transaction != null) {
      this.update(data);
    } else {
      this.create(data);
    }
    if (this.props.postSubmit != null) {
      this.props.postSubmit();
    }
  }

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
        {this.props.showAccount && <td>
          <Field
            name="account_id"
            component={SimpleSelectField}
            placeholder="Account"
            options={this.props.accounts.map(cg => ({label: cg.name, value: cg.id}))} />
        </td>}
        <td>
          <Field
            name='date'
            component={DatePickerField} />
        </td>
        <td>
          <Field
            name="payee"
            component={SimpleSelectCreateField}
            placeholder="Payee"
            options={payeeOptions} />
        </td>
        <td>
          <Field
            name="category"
            component={SimpleSelectField}
            placeholder={(this.props.payeeValue && this.props.payeeValue.startsWith("transfer:")) ? "No category for transfers" : "Category"}
            disabled={this.props.payeeValue && this.props.payeeValue.startsWith("transfer:")}
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
          <ButtonCheck onClick={this.props.handleSubmit(this.onSubmit)}/>
        </td>
      </tr>
    );
  }
}

export default TransactionForm;
