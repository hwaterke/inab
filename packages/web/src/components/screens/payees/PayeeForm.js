import {PayeeResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form'
import styled from 'styled-components'
import {Box} from '../../presentational/atoms/Box'
import {ButtonIcon} from '../../presentational/atoms/ButtonIcon'
import {Label} from '../../presentational/atoms/Label'
import {InputField} from '../../forms/fields/InputField'
import {FormActionBar} from '../../forms/FormActionBar'
import {required} from '../../forms/validations'

const LocationContainer = styled.div`
  margin: 1rem;
  max-width: 20rem;
`

const renderLocations = ({fields}) => (
  <Fragment>
    <ButtonIcon onClick={() => fields.push()} icon="plus">
      Add location
    </ButtonIcon>

    <div className="is-flex">
      {fields.map((location, index) => (
        <LocationContainer key={index}>
          <Box>
            <Field
              name={`${location}.latitude`}
              component={InputField}
              label="Latitude"
              type="number"
              placeholder="Latitude"
              validate={[required]}
            />

            <Field
              name={`${location}.longitude`}
              component={InputField}
              label="Longitude"
              type="number"
              placeholder="Longitude"
              validate={[required]}
            />

            <ButtonIcon
              color="danger"
              onClick={() => fields.remove(index)}
              icon="trash"
            />
          </Box>
        </LocationContainer>
      ))}
    </div>
  </Fragment>
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

        <div className="field">
          <Label>Locations</Label>
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
