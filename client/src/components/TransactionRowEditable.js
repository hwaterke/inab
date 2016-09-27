import React from 'react';
import DatePicker from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');
require('react-selectize/themes/index.css');
import { Field, reduxForm } from 'redux-form';
import Link from './Link';
import { getCategories } from '../selectors/categories';
import { getAccounts } from '../selectors/accounts';
import { getPayees } from '../selectors/transactions';
import FontAwesome from 'react-fontawesome';
import ui from 'redux-ui';
import { connect } from 'react-redux';
import { SimpleSelect } from 'react-selectize';

const mapStateToProps = (state) => ({
  accounts: getAccounts(state),
  categories: getCategories(state),
  payees: getPayees(state)
});

const DatePickerField = (props) => <DatePicker className="form-control" selected={props.input.value} onChange={param => props.input.onChange(param)} />;

const SimpleSelectField = (props) => <SimpleSelect placeholder={props.placeholder} disabled={props.disabled} options={props.options} onValueChange={item => props.input.onChange(item.value)}></SimpleSelect>;

class SimpleSelectCreateField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {options: props.options};
  }

  render() {
    return (<SimpleSelect
      options={this.state.options}
      placeholder={this.props.placeholder}

      createFromSearch={(options, search) => {
        if (search.length == 0 || (options.map(function(option){
          return option.label;
        })).indexOf(search) > -1)
          return null;
        else
          return {label: search, value: search};
      }}

      onValueChange={(item) => {
        if (!!item && !!item.newOption) {
          this.state.options.unshift({label: item.label, value: item.value});
          this.setState({options: this.state.options});
        }
        this.props.input.onChange(item.value);
        if (this.props.onValueChange) {
          this.props.onValueChange(item);
        }
      }} />
    );
  }
}


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

    // Todo, use a boolean that tells whether or not to have a field for the account
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
        <td>
          <Field name='datee' component={DatePickerField} />
        </td>
        <td>
          <Field
            name="payee"
            component={SimpleSelectCreateField}
            placeholder="Payee"
            options={payeeOptions}
            onValueChange={(item) => this.props.updateUI('isTransfer', item.value.startsWith("transfer:"))}
           />
        </td>
        <td>
          <Field name="category" component={SimpleSelectField} options={categoryOptions} disabled={this.props.ui.isTransfer} placeholder={this.props.ui.isTransfer ? "No category for transfers" : "Category"} />
        </td>
        <td>
          <Field name="description" component="input" className="form-control" type="text" placeholder="Description" />
        </td>
        <td>
          <Field name="amount" component="input" className="form-control" type="text" placeholder="Amount" />
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
