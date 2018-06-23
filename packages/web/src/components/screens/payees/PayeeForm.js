import arrayMutators from 'final-form-arrays'
import PropTypes from 'prop-types'
import React, {Fragment} from 'react'
import {Field, Form} from 'react-final-form'
import {FieldArray} from 'react-final-form-arrays'
import styled from 'styled-components'
import {InputField} from '../../forms/fields/InputField'
import {FormActionBar} from '../../forms/FormActionBar'
import {required} from '../../forms/validations'
import {Box} from '../../presentational/atoms/Box'
import {ButtonIcon} from '../../presentational/atoms/ButtonIcon'
import {Label} from '../../presentational/atoms/Label'

const LocationContainer = styled.div`
  margin: 1rem;
  max-width: 20rem;
`

export class PayeeForm extends React.Component {
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
        mutators={arrayMutators}
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

            <div className="field">
              <Label>Locations</Label>
              <FieldArray name="locations">
                {({fields}) => (
                  <Fragment>
                    <ButtonIcon
                      type="button"
                      onClick={() => fields.push()}
                      icon="plus"
                    >
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
                              validate={required}
                            />

                            <Field
                              name={`${location}.longitude`}
                              component={InputField}
                              label="Longitude"
                              type="number"
                              placeholder="Longitude"
                              validate={required}
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
                )}
              </FieldArray>
            </div>

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
