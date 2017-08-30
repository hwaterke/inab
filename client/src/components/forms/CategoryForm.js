import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form';
import {connect} from 'react-redux';
import {SimpleSelectField} from './fields/SimpleSelectField';
import {CategoryResource, CategoryGroupResource} from 'inab-shared';
import {FormActionBar} from './FormActionBar';
import {arraySelector, resourceForm} from 'hw-react-shared';
import {crud} from '../../hoc/crud';

const mapStateToProps = state => ({
  categoryGroups: arraySelector(CategoryGroupResource)(state)
});

@connect(mapStateToProps)
class CategoryForm extends React.Component {
  static propTypes = {
    updatedResource: CategoryResource.propType,
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func.isRequired,
    categoryGroups: PropTypes.arrayOf(CategoryGroupResource.propType).isRequired
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className="form-group">
          <label>Category group</label>
          <Field
            name="category_group_uuid"
            component={SimpleSelectField}
            placeholder="Category group"
            options={this.props.categoryGroups.map(cg => ({label: cg.name, value: cg.uuid}))}
          />
        </div>

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
  return {...data, priority: parseInt(data.priority, 10)};
};

export default resourceForm(crud, CategoryResource, formToResource)(CategoryForm);
