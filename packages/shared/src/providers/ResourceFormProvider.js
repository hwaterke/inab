import PropTypes from 'prop-types'
import React from 'react'
import {ResourceProvider} from 'redux-crud-provider'
import {ResourceCreator} from './ResourceCreator'

export class ResourceFormProvider extends React.Component {
  static propTypes = {
    crudThunks: PropTypes.object.isRequired,

    /** The uuid of the resource being updated. Undefined for resource creation */
    uuid: PropTypes.string,

    /** Optional prop to transform data before sending it */
    formToResource: PropTypes.func,
    /** Optional prop to transform data before sending it */
    resourceToForm: PropTypes.func,

    children: PropTypes.func.isRequired,

    /** The resource definition */
    resource: PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }).isRequired,

    /** A function that will be called upon success only if the component is still on the page */
    postAction: PropTypes.func,
  }

  static defaultProps = {
    formToResource: (data) => data,
    resourceToForm: (data) => data,
  }

  render() {
    const {
      crudThunks,
      uuid,
      resource,
      formToResource,
      resourceToForm,
      postAction,
      children,
    } = this.props

    if (!uuid) {
      return (
        <ResourceCreator
          crudThunks={crudThunks}
          resource={resource}
          formToResource={formToResource}
          postAction={postAction}
        >
          {({createEntity}) =>
            children({
              onSubmit: createEntity,
              isCreate: true,
              isUpdate: false,
              initialValues: resourceToForm(),
            })
          }
        </ResourceCreator>
      )
    }

    return (
      <ResourceProvider
        crudThunks={crudThunks}
        uuid={uuid}
        resource={resource}
        autoFetch
        postAction={postAction}
      >
        {({entity, updateEntity, deleteEntity, isUpdating, isRemoving}) =>
          children({
            onSubmit: (data) => updateEntity(formToResource(data)),
            isCreate: false,
            isUpdate: true,
            deleteResource: deleteEntity,
            initialValues: resourceToForm(entity),
          })
        }
      </ResourceProvider>
    )
  }
}
