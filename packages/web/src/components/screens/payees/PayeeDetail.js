import {PayeeResource, ResourceFormProvider} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {crudThunks} from '../../../thunks/crudThunks'
import {Section} from '../../presentational/atoms/Section'
import {Title} from '../../presentational/atoms/Title'
import {Box} from '../../presentational/atoms/Box'
import {PayeeForm} from './PayeeForm'

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
  <Section>
    <Box>
      <Title>Payee</Title>

      <ResourceFormProvider
        crudThunks={crudThunks}
        uuid={match.params.uuid}
        resource={PayeeResource}
        formToResource={formToResource}
        postAction={history.goBack}
      >
        {props => <PayeeForm {...props} />}
      </ResourceFormProvider>
    </Box>
  </Section>
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
