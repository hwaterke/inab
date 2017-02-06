import React from 'react';
import ButtonCheck from '../ButtonCheck';
import ButtonDelete from '../ButtonDelete';
import {Field, reduxForm} from 'redux-form';
import asyncActionCreatorsFor from '../../actions/asyncActionCreatorsFor';
import {connect} from 'react-redux';
import {CategoryGroupResource} from '../../entities/CategoryGroup';

@connect(null, asyncActionCreatorsFor(CategoryGroupResource.path), (stateProps, dispatchProps, ownProps) =>
  Object.assign(
    {},
    ownProps,
    stateProps,
    dispatchProps,
    (ownProps.categoryGroup != null) ? {
      initialValues: {
        name: ownProps.categoryGroup.name,
        priority: ownProps.categoryGroup.priority,
      }
    } : null)
)
@reduxForm({form: 'categoryGroup'})
class CategoryGroupForm extends React.Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    create: React.PropTypes.func.isRequired,
    update: React.PropTypes.func.isRequired,
    delete: React.PropTypes.func.isRequired,
    categoryGroup: CategoryGroupResource.propType,
    postSubmit: React.PropTypes.func,
    handleSubmit: React.PropTypes.func.isRequired
  };

  delete() {
    this.props.delete({
      id: this.props.categoryGroup.id
    });
    if (this.props.postSubmit != null) {
      this.props.postSubmit();
    }
  }

  onSubmit(data) {
    const categoryGroup = {
      name: data.name,
      priority: parseInt(data.priority)
    };

    if (this.props.categoryGroup != null) {
      categoryGroup.id = this.props.categoryGroup.id;
      this.props.update(categoryGroup);
    } else {
      this.props.create(categoryGroup);
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
        {this.props.categoryGroup != null && <ButtonDelete onClick={this.delete} />}
      </div>
    );
  }
}

export default CategoryGroupForm;
