import {getSortedPayees, PayeeResource} from '@inab/shared'
import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {ResourceListProvider} from 'redux-crud-provider'
import {crudThunks} from '../../../thunks/crudThunks'
import {Box} from '../../presentational/atoms/Box'

const mapStateToProps = state => ({
  payees: getSortedPayees(state),
})

@connect(mapStateToProps)
export class PayeeList extends React.Component {
  static propTypes = {
    payees: PropTypes.arrayOf(PayeeResource.propTypes).isRequired,
  }

  render() {
    return (
      <ResourceListProvider
        crudThunks={crudThunks}
        resource={PayeeResource}
        autoFetch
      >
        {() => (
          <div className="container">
            <div className="row">
              <div className="col-sm-8">
                <Box>
                  <h4>Payees</h4>

                  <div className="my-3">
                    <Link to="/payees/new" className="btn btn-primary">
                      New payee
                    </Link>
                  </div>

                  <div className="list-group">
                    {this.props.payees.map(payee => (
                      <Link
                        key={payee.uuid}
                        to={`/payees/edit/${payee.uuid}`}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                      >
                        <span>{payee.name}</span>
                        <span className="badge badge-secondary badge-pill">
                          {payee.locations.length}
                        </span>
                      </Link>
                    ))}
                  </div>
                </Box>
              </div>

              <div className="col-sm-4">
                <Box>
                  <h4>Statistics</h4>
                  <h5>{this.props.payees.length} payees</h5>
                  <h5>
                    {this.props.payees.reduce(
                      (acc, v) => acc + v.locations.length,
                      0
                    )}{' '}
                    locations
                  </h5>
                </Box>
              </div>
            </div>
          </div>
        )}
      </ResourceListProvider>
    )
  }
}
