import React from 'react'
import PropTypes from 'prop-types'
import {PayeeResource} from 'inab-shared'
import {Box} from '../../presentational/atoms/Box'
import {PayeeForm} from './PayeeForm'
import {ResourceFormProvider} from '../../../providers/ResourceFormProvider'

function formToResource(formData) {
  if (formData.locations) {
    return {
      ...formData,
      locations: formData.locations.map(location => ({
        longitude: Number(location.longitude),
        latitude: Number(location.latitude),
      })),
    }
  }
  return {...formData, locations: []}
}

export const PayeeDetail = ({match, history}) => (
  <div className="container">
    <div className="row">
      <div className="col">
        <Box>
          <h4>Payee</h4>

          <ResourceFormProvider
            uuid={match.params.uuid}
            resource={PayeeResource}
            formToResource={formToResource}
            postAction={history.goBack}
          >
            {props => <PayeeForm {...props} />}
          </ResourceFormProvider>
        </Box>
      </div>
    </div>
  </div>
)

PayeeDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      uuid: PropTypes.string,
    }).isRequired,
  }).isRequired,

  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
}
