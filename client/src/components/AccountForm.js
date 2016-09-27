import React from 'react';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

class AccountForm extends React.Component {
  static propTypes = {
    handleSubmit: React.PropTypes.func.isRequired,
    create: React.PropTypes.func.isRequired,
    removeModal: React.PropTypes.func.isRequired
  };

  onSubmit(data) {
    this.props.create({
      name: data.name
    });
    this.props.removeModal();
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(::this.onSubmit)}>
        <h2>Account</h2>
        <div className='form-group'>
          <label>Name</label>
          <Field name="name" component="input" type="text" className='form-control' placeholder="Name" autoFocus />
        </div>
        <button type="submit" className='btn btn-default'>Submit</button>
      </form>
    );
  }
}

const connected = connect(null, asyncActionCreatorsFor('accounts'))(AccountForm);
export default reduxForm({form: 'account'})(connected);
