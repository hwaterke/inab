import React from 'react'
import PropTypes from 'prop-types'
import {Field, FieldArray, reduxForm} from 'redux-form'
import {PayeeResource} from '@inab/shared'
import {FormActionBar} from '../../forms/FormActionBar'
import ButtonCheck from '../../ButtonCheck'
import ButtonDelete from '../../ButtonDelete'
import {required} from '../../forms/validations'
import {InputField} from '../../forms/fields/InputField'

const renderLocations = ({fields}) => (
  <div>
    <ButtonCheck onClick={() => fields.push()}>Add location</ButtonCheck>

    <div className="d-flex flex-wrap">
      {fields.map((location, index) => (
        <div className="card m-3" key={index} style={{maxWidth: '20rem'}}>
          <div className="card-body">
            <div className="form-group">
              <label>Latitude</label>
              <Field
                name={`${location}.latitude`}
                component={InputField}
                type="number"
                placeholder="Latitude"
                validate={[required]}
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <Field
                name={`${location}.longitude`}
                component={InputField}
                type="number"
                placeholder="Longitude"
                validate={[required]}
              />
            </div>

            <ButtonDelete onClick={() => fields.remove(index)} />
          </div>
        </div>
      ))}
    </div>
  </div>
)

renderLocations.propTypes = {
  fields: PropTypes.object.isRequired,
}

@reduxForm({form: PayeeResource.name})
export class PayeeForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
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

        <div className="form-group">
          <label>Locations</label>
          <FieldArray name="locations" component={renderLocations} />
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
    )
  }
}
