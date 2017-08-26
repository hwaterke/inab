import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {arraySelector} from 'hw-react-shared';
import {PayeeResource} from 'inab-shared';
import {Link} from 'react-router-dom';
import './PayeeList.scss';

const mapStateToProps = (state, ownProps) => ({
  payees: arraySelector(PayeeResource)(state)
});

@connect(mapStateToProps)
export class PayeeList extends React.Component {
  static propTypes = {
    payees: PropTypes.arrayOf(PayeeResource.propType).isRequired
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-8">
            <div className="payee-box">
              <h4>Payees</h4>

              <div className="list-group">
                {this.props.payees.map(payee =>
                  <Link
                    key={payee.uuid}
                    to={`/payees/${payee.uuid}`}
                    className="list-group-item list-group-item-action"
                  >
                    {payee.name}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="col">
            <div className="payee-box">
              <h4>Payees</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
