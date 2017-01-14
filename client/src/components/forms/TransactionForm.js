import React, {Component} from "react";
import "./TransactionForm.scss";
import {Field, FieldArray, reduxForm, formValueSelector} from "redux-form";
import SimpleSelectField from "./fields/SimpleSelectField";
import {connect} from "react-redux";
import {getAccounts} from "../../selectors/accounts";
import {getCategories} from "../../selectors/categories";
import {getPayees} from "../../selectors/transactions";
import DatePickerField from "./fields/DatePickerField";
import SimpleSelectCreateField from "./fields/SimpleSelectCreateField";
import ButtonDelete from "../ButtonDelete";
import ButtonCheck from "../ButtonCheck";
import ButtonIcon from "../ButtonIcon";
import Button from "../Button";
import asyncActionCreatorsFor from "../../actions/asyncActionCreatorsFor";
import moment from "moment";
import {amountFromCents, amountToCents} from "../../utils/amount";

/**
 * Component used for rendering the subtransaction forms
 */
const renderSubtransactions = ({fields, showAccount, categories}) => (
  <div>
    {fields.map((subtransaction, index) =>
      <div key={index} className="tr-form-container">

        {showAccount && <div />}

        <div />

        <div>
          <div className="btn-group btn-group-sm">
            <Button>{index + 1}</Button>
            <ButtonDelete onClick={() => fields.remove(index)}/>
          </div>
        </div>

        <div>
          <Field
            name={`${subtransaction}.category`}
            component={SimpleSelectField}
            placeholder="Category"
            options={categories}
          />
        </div>

        <div>
          <Field
            name={`${subtransaction}.description`}
            component="input"
            className="form-control"
            type="text"
            placeholder="Description"
          />
        </div>

        <div>
          <Field
            name={`${subtransaction}.amount`}
            component="input"
            className="form-control"
            type="number"
            placeholder="Amount"
          />
        </div>

      </div>
    )}
    <div className="tr-form-container str-form-container">
      {showAccount && <div />}
      <div></div>
      <div>
        <ButtonIcon className="btn btn-info" onClick={() => fields.push({})} icon="plus">
          Subtransaction
        </ButtonIcon>
      </div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

renderSubtransactions.propTypes = {
  fields: React.PropTypes.object.isRequired,
  showAccount: React.PropTypes.bool.isRequired,
  categories: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.any.isRequired
  })).isRequired,
};

const selector = formValueSelector('transaction');

const mapStateToProps = (state) => ({
  accounts: getAccounts(state),
  categories: getCategories(state),
  payees: getPayees(state),
  payeeValue: selector(state, 'payee'),
  categoryValue: selector(state, 'category')
});

const createInitialValues = (stateProps, dispatchProps, ownProps) => {
  const initialValues = {
    account_id: ownProps.selectedAccountId,
    date: moment().format("YYYY-MM-DD")
  };
  if (ownProps.transaction != null) {
    initialValues.account_id = ownProps.transaction.account_id;
    initialValues.date = ownProps.transaction.date;
    if (ownProps.transaction.transfer_account_id) {
      initialValues.payee = "transfer:" + ownProps.transaction.transfer_account_id;
    } else {
      initialValues.payee = ownProps.transaction.payee;
    }
    if (ownProps.transaction.type === 'to_be_budgeted') {
      initialValues.category = 'tbb';
    } else if (ownProps.transaction.type === 'split') {
      initialValues.category = 'split';
    } else {
      initialValues.category = ownProps.transaction.category_id;
    }
    initialValues.description = ownProps.transaction.description;
    initialValues.amount = amountFromCents(ownProps.transaction.amount);
    initialValues.subtransactions = ownProps.transaction.subtransactions.map(str => ({
      amount: amountFromCents(str.amount),
      description: str.description,
      category: str.category_id
    }));
  }
  return Object.assign({}, ownProps, stateProps, dispatchProps, {initialValues});
};

@connect(
  mapStateToProps,
  asyncActionCreatorsFor('transactions'),
  createInitialValues
)
@reduxForm({form: 'transaction', enableReinitialize: true})
export default class TransactionForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.delete = this.delete.bind(this);
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
    categoryValue: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),

    transaction: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired
    }),
    postSubmit: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    showAccount: React.PropTypes.bool.isRequired,

    handleSubmit: React.PropTypes.func.isRequired
  };

  onSubmit(data) {
    // Lets work on a copy of the form data
    data = Object.assign({}, data);

    // Compute the type of transaction
    data.type = 'regular';
    if (data.category === 'tbb') {
      data.type = 'to_be_budgeted';
      data.category = null;
    } else if (data.category === 'split') {
      data.type = 'split';
      data.category = null;
    } else {
      data.category_id = data.category;
    }

    // Compute the transfer_account_id
    data.transfer_account_id = null;
    if (data.payee && data.payee.startsWith("transfer:")) {
      data.transfer_account_id = parseInt(data.payee.slice("transfer:".length));
      data.payee = null;
    }

    data.amount = amountToCents(data.amount);

    // Update the subtransactions
    if (data.type === 'split' && data.subtransactions) {
      data.subtransactions = data.subtransactions.map(str => ({
        amount: amountToCents(str.amount),
        category_id: str.category,
        description: str.description
      }));
    } else {
      data.subtransactions = [];
    }

    if (this.props.transaction != null) {
      this.props.update({
        ...data,
        id: this.props.transaction.id
      });
    } else {
      this.props.create(data);
    }
    if (this.props.postSubmit != null) {
      this.props.postSubmit();
    }
  }

  delete() {
    this.props.delete({
      id: this.props.transaction.id
    });
    if (this.props.postSubmit != null) {
      this.props.postSubmit();
    }
  }

  render() {
    const categoryOptions = [
      {label: "To be budgeted", value: "tbb"},
      {label: "Split", value: "split"},
      ...this.props.categories.map(c => ({label: c.name, value: c.id}))
    ];

    const subtransactionCategoryOptions = [
      {label: "To be budgeted", value: "tbb"},
      ...this.props.categories.map(c => ({label: c.name, value: c.id}))
    ];

    const payeeOptions = [
      ...this.props.accounts.map(a => ({label: "Tranfer to " + a.name, value: "transfer:" + a.id})),
      ...this.props.payees.map(c => ({label: c, value: c}))
    ];

    return (
      <form className="box-container">
        <div className="tr-form-container">
          {this.props.showAccount &&
          <div>
            <label>Account</label>
            <Field
              name="account_id"
              component={SimpleSelectField}
              placeholder="Account"
              options={this.props.accounts.map(cg => ({label: cg.name, value: cg.id}))}
            />
          </div>
          }

          <div>
            <label>Date</label>
            <div>
              <Field
                name='date'
                component={DatePickerField}
              />
            </div>
          </div>

          <div>
            <label>Payee</label>
            <Field
              name="payee"
              component={SimpleSelectCreateField}
              placeholder="Payee"
              options={payeeOptions}
            />
          </div>

          <div>
            <label>Category</label>
            <Field
              name="category"
              component={SimpleSelectField}
              placeholder={(this.props.payeeValue && this.props.payeeValue.startsWith("transfer:")) ? "No category for transfers" : "Category"}
              disabled={this.props.payeeValue && this.props.payeeValue.startsWith("transfer:")}
              options={categoryOptions}
            />
          </div>

          <div>
            <label>Description</label>
            <Field
              name="description"
              component="input"
              className="form-control"
              type="text"
              placeholder="Description"
            />
          </div>

          <div>
            <label>Amount</label>
            <Field
              name="amount"
              component="input"
              className="form-control"
              type="number"
              placeholder="Amount"
            />
          </div>
        </div>
        {this.props.categoryValue === "split" &&
        <FieldArray name="subtransactions"
                    categories={subtransactionCategoryOptions}
                    showAccount={this.props.showAccount}
                    component={renderSubtransactions}/>}

        <div className="btn-group">
          <ButtonCheck onClick={this.props.handleSubmit(this.onSubmit)}>
            {this.props.transaction ? 'Update' : 'Create'}
          </ButtonCheck>

          <ButtonIcon onClick={this.props.onCancel} icon="ban">
            Cancel
          </ButtonIcon>

          {
            this.props.transaction &&
            <ButtonDelete onClick={this.delete}>Delete</ButtonDelete>
          }
        </div>

      </form>
    );
  }
}
