import React from 'react';
import ButtonDelete from '../ButtonDelete';
import { Field, reduxForm } from 'redux-form';
import asyncActionCreatorsFor from '../../actions/asyncActionCreatorsFor';
import { connect } from 'react-redux';

@connect(null, asyncActionCreatorsFor('accounts'), (stateProps, dispatchProps, ownProps) =>
  Object.assign({}, ownProps, stateProps, dispatchProps, (ownProps.account != null) ? {initialValues: {name: ownProps.account.name}} : null)
)
@reduxForm({form: 'account'})
class CategoryGroupForm extends React.Component {
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
    account: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired
    }),
    postSubmit: React.PropTypes.func,
    handleSubmit: React.PropTypes.func.isRequired
  };

  create(data) {
    this.props.create({
      name: data.name
    });
  }

  update(data) {
    this.props.update({
      id: this.props.account.id,
      name: data.name
    });
  }

  delete() {
    this.props.delete({
      id: this.props.account.id
    });
    if (this.props.postSubmit != null) {
      this.props.postSubmit();
    }
  }

  onSubmit(data) {
    if (this.props.account != null) {
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
            <label>Name</label>
            <Field
              name="name"
              component="input"
              type="text"
              className='form-control'
              placeholder="Name"
              autoFocus />
          </div>
        </form>
        {this.props.account != null && <ButtonDelete onClick={this.delete} />}
      </div>
    );
  }
}

export default CategoryGroupForm;
