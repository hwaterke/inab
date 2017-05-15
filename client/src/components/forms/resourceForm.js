// @flow
import {Component, createElement} from 'react';
import PropTypes from 'prop-types';
import {reduxForm} from 'redux-form';
import {crud} from '../../hoc/crud';
import type {ResourceDefinition} from '../../types/ResourceDefinition';

/**
 * HOC to provide CRUD functionality to a form.
 * It handles requests and the reduxForm config.
 *
 * @param resource
 * @param formToResource How to convert form data to a resource
 * @param resourceToForm How to convert a resource to form data
 * @returns {Function}
 */
export function resourceForm(
  resource: ResourceDefinition,
  formToResource: Function = v => v,
  resourceToForm: Function = v => v
) {
  return function(WrappedComponent: ReactClass<{}>): ReactClass<{}> {
    // Make a redux-form from the WrappedComponent
    const WrappedReduxFormComponent = reduxForm({
      form: resource.path,
      enableReinitialize: true
    })(WrappedComponent);

    // Create the WrapperComponent
    class ResourceForm extends Component {
      static propTypes = {
        updatedResource: PropTypes.shape({
          uuid: PropTypes.string
        }),
        createResource: PropTypes.func.isRequired,
        updateResource: PropTypes.func.isRequired,
        deleteResource: PropTypes.func.isRequired,
        postSubmit: PropTypes.func
      };

      onSubmit = data => {
        const entity = formToResource(data, this.props);
        if (this.props.updatedResource) {
          entity.uuid = this.props.updatedResource.uuid;
          this.props.updateResource(resource, entity);
        } else {
          this.props.createResource(resource, entity);
        }
        this.props.postSubmit && this.props.postSubmit();
      };

      /**
       * Delete the updatedResource
       */
      deleteResource = () => {
        this.props.deleteResource(resource, {
          uuid: this.props.updatedResource.uuid
        });
        this.props.postSubmit && this.props.postSubmit();
      };

      getPassThroughProps = () => {
        const passThroughProps = {...this.props};
        delete passThroughProps.fetchAll;
        delete passThroughProps.clearAll;
        delete passThroughProps.createResource;
        delete passThroughProps.updateResource;
        delete passThroughProps.deleteResource;
        delete passThroughProps.postSubmit;
        return passThroughProps;
      };

      render() {
        // Compute props that will passthrough.
        const passThroughProps = this.getPassThroughProps();

        return createElement(WrappedReduxFormComponent, {
          onSubmit: this.onSubmit,
          deleteResource: this.deleteResource,
          initialValues: resourceToForm(this.props.updatedResource, passThroughProps),
          isCreate: this.props.updatedResource == null,
          isUpdate: this.props.updatedResource != null,
          ...passThroughProps
        });
      }
    }

    // Extract the name of the WrappedReduxFormComponent
    const wrappedComponentName =
      WrappedReduxFormComponent.displayName || WrappedReduxFormComponent.name || 'Component';
    // Name the WrapperComponent accordingly
    ResourceForm.displayName = `ResourceForm(${wrappedComponentName})`;

    return crud(ResourceForm);
  };
}
