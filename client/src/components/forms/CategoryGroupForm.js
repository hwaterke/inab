import React from 'react';
import {Field} from 'redux-form';
import {CategoryGroupResource} from '../../entities/CategoryGroup';
import {resourceForm} from './resourceForm';
import {FormActionBar} from './FormActionBar';

class CategoryGroupForm extends React.Component {
  static propTypes = {
    updatedResource: CategoryGroupResource.propType,
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

const formToResource = (data) => {
  return {...data, priority: parseInt(data.priority)};
};

export default resourceForm(CategoryGroupResource.path, formToResource)(CategoryGroupForm);
