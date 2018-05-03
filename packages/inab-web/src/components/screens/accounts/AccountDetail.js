import {AccountResource} from 'inab-shared'
import PropTypes from 'prop-types'
import React from 'react'
import {ResourceFormProvider} from '../../../providers/ResourceFormProvider'
import {Box} from '../../presentational/atoms/Box'
import {AccountForm} from './AccountForm'

export const AccountDetail = ({match, history}) => (
  <div className="container">
    <div className="row">
      <div className="col">
        <Box>
          <h4>Account</h4>

          <ResourceFormProvider
            uuid={match.params.uuid}
            resource={AccountResource}
            postAction={history.goBack}
          >
            {props => <AccountForm {...props} />}
          </ResourceFormProvider>
        </Box>
      </div>
    </div>
  </div>
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
