import {CategoryGroupResource} from 'inab-shared'
import PropTypes from 'prop-types'
import React from 'react'
import {ResourceFormProvider} from '../../../providers/ResourceFormProvider'
import {CategoryGroupForm} from './CategoryGroupForm'

const formToResource = data => {
  return {...data, priority: parseInt(data.priority, 10)}
}

export const CategoryGroupDetail = ({match, history}) => (
  <div className="container">
    <div className="row">
      <div className="col">
        <div className="mt-4 p-4 box">
          <h4>Category Group</h4>

          <ResourceFormProvider
            uuid={match.params.uuid}
            resource={CategoryGroupResource}
            formToResource={formToResource}
            postAction={history.goBack}
          >
            {props => <CategoryGroupForm {...props} />}
          </ResourceFormProvider>
        </div>
      </div>
    </div>
  </div>
)

CategoryGroupDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      uuid: PropTypes.string,
    }).isRequired,
  }).isRequired,

  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
}
