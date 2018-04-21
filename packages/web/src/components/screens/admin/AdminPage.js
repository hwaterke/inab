import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {connect} from 'react-redux'

const mapStateToProps = state => ({
  backend: state.credentials.backend,
  token: state.credentials.token,
})

@connect(mapStateToProps)
export class AdminPage extends React.Component {
  static propTypes = {
    backend: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }

  state = {
    loading: true,
    registration: false,
  }

  componentDidMount() {
    this.setState({loading: true})
    axios({
      url: `${this.props.backend}/settings/registration`,
      method: 'get',
      headers: {Authorization: this.props.token},
    }).then(response => {
      this.setState({loading: false, registration: response.data.value === '1'})
    })
  }

  toggleRegistration = () => {
    this.setState({loading: true})
    axios({
      url: `${this.props.backend}/settings/registration`,
      method: 'patch',
      headers: {Authorization: this.props.token},
      data: {value: this.state.registration ? '0' : '1'},
    }).then(response => {
      this.setState({loading: false, registration: response.data.value === '1'})
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-2" />
          <div className="col-sm-8">
            <div className="mt-4 p-4 box">
              <h4>Administration</h4>

              {this.state.loading ? (
                <div className="alert alert-secondary">Loading</div>
              ) : (
                <div
                  className={`alert ${
                    this.state.registration ? 'alert-success' : 'alert-danger'
                  }`}
                >
                  {this.state.registration
                    ? 'Registrations are open'
                    : 'Registrations are closed'}
                </div>
              )}

              {!this.state.loading && (
                <button
                  onClick={this.toggleRegistration}
                  className="btn btn-primary"
                >
                  Toggle registration
                </button>
              )}
            </div>
          </div>
          <div className="col-sm-2" />
        </div>
      </div>
    )
  }
}
