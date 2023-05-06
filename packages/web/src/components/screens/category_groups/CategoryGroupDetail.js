import {CategoryGroupResource, ResourceFormProvider} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {crudThunks} from '../../../thunks/crudThunks'
import {Section} from '../../presentational/atoms/Section'
import {Title} from '../../presentational/atoms/Title'
import {Box} from '../../presentational/atoms/Box'
import {CategoryGroupForm} from './CategoryGroupForm'

const formToResource = (data) => {
  return {...data, priority: parseInt(data.priority, 10)}
}

export const CategoryGroupDetail = ({match, history}) => (
  <Section>
    <Box>
      <Title>Category Group</Title>

      <ResourceFormProvider
        crudThunks={crudThunks}
        uuid={match.params.uuid}
        resource={CategoryGroupResource}
        formToResource={formToResource}
        postAction={history.goBack}
      >
        {(props) => <CategoryGroupForm {...props} />}
      </ResourceFormProvider>
    </Box>
  </Section>
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
