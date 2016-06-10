'use strict';
import React from 'react';
import asyncActionCreatorsFor from '../actions/asyncActionCreatorsFor';
import {reduxForm} from 'redux-form';

class AccountForm extends React.Component {
  onSubmit(data) {
    this.props.create({
      name: data.name
    });
    this.props.removeModal();
  }

  render() {
    const {
      fields: { name },
      handleSubmit
    } = this.props;
    return (
      <form onSubmit={handleSubmit(::this.onSubmit)}>
        <h2>Account</h2>
        <div className='form-group'>
          <label>Name</label>
          <input type="text" className='form-control' placeholder="Name" autoFocus {...name}/>
        </div>
        <button type="submit" className='btn btn-default'>Submit</button>
      </form>
    );
  }
}

AccountForm.propTypes = {
  fields: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  create: React.PropTypes.func.isRequired,
  removeModal: React.PropTypes.func.isRequired
};

export default reduxForm({
  form: 'account',
  fields: ['name']
}, null, asyncActionCreatorsFor('accounts'))(AccountForm);
