import React from 'react';
import {Field} from 'redux-form';
import {connect} from 'react-redux';
import SimpleSelectField from './fields/SimpleSelectField';
import {getCategoryGroups} from '../../selectors/categoryGroups';
import {CategoryResource} from '../../entities/Category';
import {CategoryGroupResource} from '../../entities/CategoryGroup';
import {resourceForm} from './resourceForm';
import {FormActionBar} from './FormActionBar';

const mapStateToProps = (state) => ({
  categoryGroups: getCategoryGroups(state)
});

@connect(mapStateToProps)
class CategoryForm extends React.Component {
  static propTypes = {
    updatedResource: CategoryResource.propType,
    isCreate: React.PropTypes.bool.isRequired,
    isUpdate: React.PropTypes.bool.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    reset: React.PropTypes.func.isRequired,
    pristine: React.PropTypes.bool.isRequired,
    submitting: React.PropTypes.bool.isRequired,
    deleteResource: React.PropTypes.func.isRequired,
    categoryGroups: React.PropTypes.arrayOf(CategoryGroupResource.propType).isRequired
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

const formToResource = (data) => {
  return {...data, priority: parseInt(data.priority)};
};

export default resourceForm(CategoryResource.path, formToResource)(CategoryForm);
