import React from 'react';
import {Field} from 'redux-form';
import {AccountResource} from '../../entities/Account';
import {resourceForm} from './resourceForm';
import {FormActionBar} from './FormActionBar';

class AccountForm extends React.Component {
  static propTypes = {
    updatedResource: AccountResource.propType,
    isCreate: React.PropTypes.bool.isRequired,
    isUpdate: React.PropTypes.bool.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    reset: React.PropTypes.func.isRequired,
    pristine: React.PropTypes.bool.isRequired,
    submitting: React.PropTypes.bool.isRequired,
    deleteResource: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>

        <div className="form-group">
          <label>Name</label>
          <Field
            name="name"
            component="input"
            type="text"
            className="form-control"
            placeholder="Name"
            autoFocus
          />
        </div>

        <FormActionBar
          handleSubmit={this.props.handleSubmit}
          isCreate={this.props.isCreate}
          isUpdate={this.props.isUpdate}
          disableReset={this.props.pristine || this.props.submitting}
          reset={this.props.reset}
          remove={this.props.deleteResource}
        />

      </form>
    );
  }
}

export default resourceForm(AccountResource.path)(AccountForm);
