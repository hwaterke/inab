import PropTypes from 'prop-types'
import React from 'react'
import {Field, Form} from 'react-final-form'
import {InputField} from '../../forms/fields/InputField'
import {FormActionBar} from '../../forms/FormActionBar'
import {required} from '../../forms/validations'

export class AccountForm extends React.Component {
  static propTypes = {
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
  }

  render() {
    return (
      <Form
        onSubmit={this.props.onSubmit}
        initialValues={this.props.initialValues}
      >
        {({handleSubmit, form, pristine, submitting}) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="name"
              component={InputField}
              type="text"
              label="Name"
              validate={required}
              required
            />

            <FormActionBar
              handleSubmit={handleSubmit}
              isCreate={this.props.isCreate}
              isUpdate={this.props.isUpdate}
              disableReset={pristine || submitting}
              reset={() => form.reset()}
              remove={this.props.deleteResource}
            />
          </form>
        )}
      </Form>
    )
  }
}
