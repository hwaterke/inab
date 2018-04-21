import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {AccountResource} from 'inab-shared'
import {byIdSelector} from 'hw-react-shared'
import {AccountForm} from './AccountForm'

const mapStateToProps = state => ({
  accountsById: byIdSelector(AccountResource)(state),
})

@connect(mapStateToProps)
export class AccountDetail extends React.Component {
  static propTypes = {
    accountsById: PropTypes.objectOf(AccountResource.propType).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="mt-4 p-4 box">
              <h4>Account</h4>

              <AccountForm
                updatedResource={
                  this.props.match.params.uuid &&
                  this.props.accountsById[this.props.match.params.uuid]
                }
                postSubmit={this.props.history.goBack}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
