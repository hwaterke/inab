import {CategoryGroupResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {InputField} from '../../forms/fields/InputField'
import {FormActionBar} from '../../forms/FormActionBar'
import {required} from '../../forms/validations'

@reduxForm({form: CategoryGroupResource.name})
export class CategoryGroupForm extends React.Component {
  static propTypes = {
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func,
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          name="name"
          component={InputField}
          type="text"
          label="Name"
          validate={[required]}
          required
        />

        <Field
          name="priority"
          component={InputField}
          type="number"
          label="Priority"
        />

        <FormActionBar
          handleSubmit={this.props.handleSubmit}
          isCreate={this.props.isCreate}
          isUpdate={this.props.isUpdate}
          disableReset={this.props.pristine || this.props.submitting}
          reset={this.props.reset}
          remove={this.props.deleteResource}
        />
      </form>
    )
  }
}
