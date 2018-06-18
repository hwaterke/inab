import {AccountResource, ResourceFormProvider} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {crudThunks} from '../../../thunks/crudThunks'
import {Section} from '../../presentational/atoms/Section'
import {Title} from '../../presentational/atoms/Title'
import {Box} from '../../presentational/atoms/Box'
import {AccountForm} from './AccountForm'

export const AccountDetail = ({match, history}) => (
  <Section>
    <Box>
      <Title>Account</Title>

      <ResourceFormProvider
        crudThunks={crudThunks}
        uuid={match.params.uuid}
        resource={AccountResource}
        postAction={history.goBack}
      >
        {props => <AccountForm {...props} />}
      </ResourceFormProvider>
    </Box>
  </Section>
)

AccountDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      uuid: PropTypes.string,
    }).isRequired,
  }).isRequired,

  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
}
