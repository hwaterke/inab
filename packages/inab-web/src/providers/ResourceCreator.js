import React from 'react'
import PropTypes from 'prop-types'
import {crudThunks} from '../thunks/crudThunks'
import {connect} from 'react-redux'

const mapDispatchToProps = {
  createResource: crudThunks.createResource,
}

class _ResourceCreator extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    resource: PropTypes.shape({
      name: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    }).isRequired,
    path: PropTypes.string,
    postAction: PropTypes.func,

    // Optional prop to transform data before sending it.
    formToResource: PropTypes.func,

    // From redux
    createResource: PropTypes.func.isRequired,
  }

  static defaultProps = {
    formToResource: data => data,
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  createEntity = entity => {
    const {resource, path, postAction, formToResource} = this.props

    return this.props
      .createResource({
        resource: resource,
        path: path,
        entity: formToResource(entity),
      })
      .then(() => {
        if (this._isMounted && postAction) {
          postAction()
        }
      })
  }

  render() {
    return this.props.children({
      createEntity: this.createEntity,
      thunks: {
        createResource: this.props.createResource,
      },
    })
  }
}

export const ResourceCreator = connect(undefined, mapDispatchToProps)(
  _ResourceCreator
)
