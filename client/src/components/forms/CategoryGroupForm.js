import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form';
import {CategoryGroupResource} from 'inab-shared/src/entities/CategoryGroup';
import {resourceForm} from './resourceForm';
import {FormActionBar} from './FormActionBar';

class CategoryGroupForm extends React.Component {
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

        <div className="form-group">
          <label>Priority</label>
          <Field
            name="priority"
            component="input"
            type="number"
            className="form-control"
            placeholder="Priority"
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

const formToResource = data => {
  return {...data, priority: parseInt(data.priority)};
};

export default resourceForm(CategoryGroupResource, formToResource)(CategoryGroupForm);
