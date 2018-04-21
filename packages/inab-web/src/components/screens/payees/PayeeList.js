import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {PayeeResource, getSortedPayees} from 'inab-shared'
import {Link} from 'react-router-dom'

const mapStateToProps = state => ({
  payees: getSortedPayees(state),
})

@connect(mapStateToProps)
export class PayeeList extends React.Component {
  static propTypes = {
    payees: PropTypes.arrayOf(PayeeResource.propType).isRequired,
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-8">
            <div className="mt-4 p-4 box">
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
            </div>
          </div>

          <div className="col-sm-4">
            <div className="mt-4 p-4 box">
              <h4>Statistics</h4>
              <h5>{this.props.payees.length} payees</h5>
              <h5>
                {this.props.payees.reduce(
                  (acc, v) => acc + v.locations.length,
                  0
                )}{' '}
                locations
              </h5>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
