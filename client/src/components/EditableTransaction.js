import React from 'react';
import DatePicker from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');
import moment from 'moment';
import {reduxForm} from 'redux-form';
import Link from './Link';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import { getCategories } from '../reducers/categories';

class EditableTransaction extends React.Component {
  onSubmit(data) {
    this.props.create({
      date: data.datee.format("YYYY-MM-DD"),
      payee: data.payee,
      category_id: data.category,
      description: data.description,
      amount: data.amount
    });
  }

  render() {
    const {fields: {datee, payee, category, description, amount}, handleSubmit} = this.props;
    return (
      <tr>
        <td><Link children={<span className="glyphicon glyphicon-plus" aria-hidden="true"></span>} onClick={handleSubmit(::this.onSubmit)} /></td>
        <td>
          {/* TODO Should this be dropped in favor of input type=date?*/}
          <DatePicker className="form-control" selected={datee.value} onChange={param => {
            return datee.onChange(param);
          }} />
        </td>
        <td><input className="form-control" type="text" placeholder="Payee" {...payee} /></td>
        <td>
          <select className="form-control" {...category} value={category.value || ''}>
            {this.props.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </td>
        <td><input className="form-control" type="text" placeholder="Description" {...description}/></td>
        <td><input className="form-control" type="text" placeholder="Amount" {...amount} /></td>
      </tr>
    );
  }
}

EditableTransaction.propTypes = {
  create: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  categories: getCategories(state)
});

export default reduxForm({
  form: 'transaction',
  fields: ['datee', 'payee', 'category', 'description', 'amount'],
  initialValues: {'datee': moment()}
}, mapStateToProps, asyncActionCreatorsFor('transactions'))(EditableTransaction);
