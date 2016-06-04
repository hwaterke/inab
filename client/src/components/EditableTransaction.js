import React from 'react';
import DatePicker from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');
import moment from 'moment';
import {reduxForm} from 'redux-form';
import Link from './Link';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';

class EditableTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(data) {
    this.props.create({
      date: data.datee.format("YYYY-MM-DD"),
      payee: data.payee,
      category: data.category,
      description: data.description,
      amount: data.amount
    });
  }

  render() {
    const {fields: {datee, payee, category, description, amount}, handleSubmit} = this.props;
    return (
      <tr>
        <td><Link children={<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>} onClick={handleSubmit(this.onSubmit)} /></td>
        <td>
          <DatePicker selected={datee.value} onChange={param => {
            return datee.onChange(param);
          }} />
        </td>
        <td><input type="text" placeholder="Payee" {...payee} /></td>
        <td><input type="text" placeholder="Category" {...category}/></td>
        <td><input type="text" placeholder="Description" {...description}/></td>
        <td><input type="text" placeholder="Amount" {...amount} /></td>
      </tr>
    );
  }
}

EditableTransaction.propTypes = {
  create: React.PropTypes.func.isRequired
};

export default reduxForm({
  form: 'transaction',
  fields: ['datee', 'payee', 'category', 'description', 'amount'],
  initialValues: {'datee': moment()}
}, null, asyncActionCreatorsFor('transactions'))(EditableTransaction);
