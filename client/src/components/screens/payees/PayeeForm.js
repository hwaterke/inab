import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form';
import {FormActionBar} from '../../forms/FormActionBar';
import {resourceForm} from 'hw-react-shared';
import {PayeeResource} from 'inab-shared';
import {crud} from '../../../hoc/crud';

function formToResource(formData, formProps) {
  return {
    ...formData,
    locations: (formProps.updatedResource && formProps.updatedResource.locations) || []
  };
}

@resourceForm(crud, PayeeResource, formToResource)
export class PayeeForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func.isRequired
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
