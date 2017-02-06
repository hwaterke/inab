import React from 'react';
import ButtonCheck from '../ButtonCheck';
import ButtonDelete from '../ButtonDelete';
import {Field, reduxForm} from 'redux-form';
import asyncActionCreatorsFor from '../../actions/asyncActionCreatorsFor';
import {connect} from 'react-redux';
import SimpleSelectField from './fields/SimpleSelectField';
import {getCategoryGroups} from '../../selectors/categoryGroups';
import {CategoryResource} from '../../entities/Category';
import {CategoryGroupResource} from '../../entities/CategoryGroup';

const mapStateToProps = (state) => ({
  categoryGroups: getCategoryGroups(state)
});

@connect(mapStateToProps, asyncActionCreatorsFor(CategoryResource.path), (stateProps, dispatchProps, ownProps) =>
  Object.assign({},
    ownProps,
    stateProps,
    dispatchProps,
    (ownProps.category != null) ? {
      initialValues: {
        category_group_id: ownProps.category.category_group_id,
        name: ownProps.category.name,
        priority: ownProps.category.priority
      }
    } : null)
)
@reduxForm({form: 'category'})
class CategoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    create: React.PropTypes.func.isRequired,
    update: React.PropTypes.func.isRequired,
    delete: React.PropTypes.func.isRequired,
    category: CategoryResource.propType,
    postSubmit: React.PropTypes.func,
    handleSubmit: React.PropTypes.func.isRequired,
    categoryGroups: React.PropTypes.arrayOf(CategoryGroupResource.propType).isRequired
  };

  delete() {
    this.props.delete({
      id: this.props.category.id
    });
    if (this.props.postSubmit != null) {
      this.props.postSubmit();
    }
  }

  onSubmit(data) {
    const category = {
      category_group_id: data.category_group_id,
      name: data.name,
      priority: parseInt(data.priority)
    };

    if (this.props.category != null) {
      category.id = this.props.category.id;
      this.props.update(category);
    } else {
      this.props.create(category);
    }
    if (this.props.postSubmit != null) {
      this.props.postSubmit();
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <div className="form-group">
            <label>Category group</label>
            <Field
              name="category_group_id"
              component={SimpleSelectField}
              placeholder="Category group"
              options={this.props.categoryGroups.map(cg => ({label: cg.name, value: cg.id}))}
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
          <ButtonCheck onClick={this.props.handleSubmit(this.onSubmit)} />
        </form>
        {this.props.category != null && <ButtonDelete onClick={this.delete} />}
      </div>
    );
  }
}

export default CategoryForm;
