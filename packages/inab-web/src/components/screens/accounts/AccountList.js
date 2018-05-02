import {AccountResource} from 'inab-shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {select} from 'redux-crud-provider'
import {Box} from '../../presentational/atoms/Box'

const mapStateToProps = state => ({
  accounts: select(AccountResource).asArray(state),
})

@connect(mapStateToProps)
export class AccountList extends React.Component {
  static propTypes = {
    accounts: PropTypes.arrayOf(AccountResource.propTypes).isRequired,
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-8">
            <Box>
              <h4>Accounts</h4>

              <div className="my-3">
                <Link to="/accounts/new" className="btn btn-primary">
                  New account
                </Link>
              </div>

              <div className="list-group">
                {this.props.accounts.map(account => (
                  <Link
                    key={account.uuid}
                    to={`/accounts/edit/${account.uuid}`}
                    className="list-group-item list-group-item-action"
                  >
                    {account.name}
                  </Link>
                ))}
              </div>
            </Box>
          </div>

          <div className="col-sm-4">
            <Box>
              <h4>Statistics</h4>
              <h5>{this.props.accounts.length} accounts</h5>
            </Box>
          </div>
        </div>
      </div>
    )
  }
}
