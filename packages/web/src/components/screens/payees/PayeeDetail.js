import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {PayeeResource} from 'inab-shared'
import {byIdSelector} from 'hw-react-shared'
import {PayeeForm} from './PayeeForm'

const mapStateToProps = state => ({
  payeesById: byIdSelector(PayeeResource)(state),
})

@connect(mapStateToProps)
export class PayeeDetail extends React.Component {
  static propTypes = {
    payeesById: PropTypes.objectOf(PayeeResource.propType).isRequired,
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
              <h4>Payee</h4>

              <PayeeForm
                updatedResource={
                  this.props.match.params.uuid &&
                  this.props.payeesById[this.props.match.params.uuid]
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
