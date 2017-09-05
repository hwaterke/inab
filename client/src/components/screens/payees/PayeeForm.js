import React from 'react';
import PropTypes from 'prop-types';
import {Field, FieldArray} from 'redux-form';
import {FormActionBar} from '../../forms/FormActionBar';
import {resourceForm} from 'hw-react-shared';
import {PayeeResource} from 'inab-shared';
import {crud} from '../../../hoc/crud';
import ButtonCheck from '../../ButtonCheck';
import ButtonDelete from '../../ButtonDelete';

function formToResource(formData) {
  if (formData.locations) {
    return {
      ...formData,
      locations: formData.locations.map(location => ({
        longitude: Number(location.longitude),
        latitude: Number(location.latitude)
      }))
    };
  }
  return {...formData, locations: []};
}

const renderLocations = ({fields}) =>
  <div>
    <ButtonCheck onClick={() => fields.push()}>Add location</ButtonCheck>

    <div className="d-flex flex-wrap">
      {fields.map((location, index) =>
        <div className="card m-3" key={index} style={{maxWidth: '20rem'}}>
          <div className="card-body">
            <div className="form-group">
              <label>Latitude</label>
              <Field
                name={`${location}.latitude`}
                type="number"
                component="input"
                className="form-control"
                placeholder="Latitude"
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <Field
                name={`${location}.longitude`}
                type="number"
                component="input"
                className="form-control"
                placeholder="Longitude"
              />
            </div>

            <ButtonDelete onClick={() => fields.remove(index)} />
          </div>
        </div>
      )}
    </div>
  </div>;

renderLocations.propTypes = {
  fields: PropTypes.object.isRequired
};

@resourceForm(crud, PayeeResource, formToResource)
export class PayeeForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isCreate: PropTypes.bool.isRequired,
    isUpdate: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    deleteResource: PropTypes.func.isRequired
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <Field
            name="name"
            component="input"
            type="text"
            className="form-control"
            placeholder="Name"
          />
        </div>

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
    );
  }
}
