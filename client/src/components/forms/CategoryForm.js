import React from 'react';
import ButtonCheck from '../ButtonCheck';
import ButtonDelete from '../ButtonDelete';
import { Field, reduxForm } from 'redux-form';
import asyncActionCreatorsFor from '../../actions/asyncActionCreatorsFor';
import { connect } from 'react-redux';
import SimpleSelectField from './fields/SimpleSelectField';
import { getCategoryGroups } from '../../selectors/categoryGroups';

const mapStateToProps = (state) => ({
  categoryGroups: getCategoryGroups(state)
});

@connect(mapStateToProps, asyncActionCreatorsFor('categories'), (stateProps, dispatchProps, ownProps) =>
  Object.assign({},
    ownProps,
    stateProps,
    dispatchProps, (ownProps.category != null) ? {
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
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  static propTypes = {
    create: React.PropTypes.func.isRequired,
    update: React.PropTypes.func.isRequired,
    delete: React.PropTypes.func.isRequired,
    category: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired
    }),
    postSubmit: React.PropTypes.func,
    handleSubmit: React.PropTypes.func.isRequired,
    categoryGroups: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired
    })).isRequired
  };

  create(data) {
    this.props.create({
      category_group_id: data.category_group_id,
      name: data.name,
      priority: data.priority
    });
  }

  update(data) {
    this.props.update({
      id: this.props.category.id,
      category_group_id: data.category_group_id,
      name: data.name,
      priority: data.priority
    });
  }

  delete() {
    this.props.delete({
      id: this.props.category.id
    });
    if (this.props.postSubmit != null) {
      this.props.postSubmit();
    }
  }

  onSubmit(data) {
    if (this.props.category != null) {
      this.update(data);
    } else {
      this.create(data);
    }
    if (this.props.postSubmit != null) {
      this.props.postSubmit();
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <div className='form-group'>
            <label>Category group</label>
            <Field
              name="category_group_id"
              component={SimpleSelectField}
              placeholder="Category group"
              options={this.props.categoryGroups.map(cg => ({label: cg.name, value: cg.id}))} />
          </div>
          <div className='form-group'>
            <label>Name</label>
            <Field
              name="name"
              component="input"
              type="text"
              className='form-control'
              placeholder="Name"
              autoFocus />
          </div>
          <div className='form-group'>
            <label>Priority</label>
            <Field
                name="priority"
                component="input"
                type="number"
                className='form-control'
                placeholder="Priority" />
          </div>
          <ButtonCheck onClick={this.props.handleSubmit(this.onSubmit)} />
        </form>
        {this.props.category != null && <ButtonDelete onClick={this.delete} />}
      </div>
    );
  }
}

export default CategoryForm;
