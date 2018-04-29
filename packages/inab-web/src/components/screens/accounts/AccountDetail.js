import React from 'react'
import PropTypes from 'prop-types'
import {AccountResource} from 'inab-shared'
import {AccountForm} from './AccountForm'
import {ResourceFormProvider} from '../../../providers/ResourceFormProvider'

export const AccountDetail = ({match, history}) => (
  <div className="container">
    <div className="row">
      <div className="col">
        <div className="mt-4 p-4 box">
          <h4>Account</h4>

          <ResourceFormProvider
            uuid={match.params.uuid}
            resource={AccountResource}
            postAction={history.goBack}
          >
            {props => <AccountForm {...props} />}
          </ResourceFormProvider>
        </div>
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
