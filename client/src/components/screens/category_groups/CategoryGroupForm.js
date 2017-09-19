import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form';
import {CategoryGroupResource} from 'inab-shared';
import {FormActionBar} from '../../forms/FormActionBar';
import {resourceForm} from 'hw-react-shared';
import {crud} from '../../../hoc/crud';
import {InputField} from '../../forms/fields/InputField';

const formToResource = data => {
  return {...data, priority: parseInt(data.priority, 10)};
};

@resourceForm(crud, CategoryGroupResource, formToResource)
export class CategoryGroupForm extends React.Component {
  static propTypes = {
    updatedResource: CategoryGroupResource.propType,
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func.isRequired
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field name="name" component={InputField} type="text" label="Name" />

        <Field name="priority" component={InputField} type="number" label="Priority" />

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
