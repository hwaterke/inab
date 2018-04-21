import React from 'react'
import PropTypes from 'prop-types'
import {Field} from 'redux-form'
import {FormActionBar} from '../../forms/FormActionBar'
import {resourceForm} from 'hw-react-shared'
import {AccountResource} from 'inab-shared'
import {crud} from '../../../hoc/crud'
import {required} from '../../forms/validations'
import {InputField} from '../../forms/fields/InputField'

@resourceForm({crud, resource: AccountResource})
export class AccountForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func.isRequired,
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
