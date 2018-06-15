import axios from 'axios'
import {selectBackend, selectToken} from '@inab/shared'
import PropTypes from 'prop-types'
import {path} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {Box} from '../../presentational/atoms/Box'

const mapStateToProps = state => ({
  backend: selectBackend(state),
  token: selectToken(state),
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
      this.setState({
        loading: false,
        registration: path(['data', 'value'], response) === '1',
      })
    })
  }

  toggleRegistration = () => {
    this.setState({loading: true})
    axios({
      url: `${this.props.backend}/settings/registration`,
      method: 'put',
      headers: {Authorization: this.props.token},
      data: {value: this.state.registration ? '0' : '1'},
    })
      .then(response => {
        this.setState({
          registration: path(['data', 'value'], response) === '1',
        })
      })
      .finally(() => {
        this.setState({
          loading: false,
        })
      })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-2" />
          <div className="col-sm-8">
            <Box>
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
            </Box>
          </div>
          <div className="col-sm-2" />
        </div>
      </div>
    )
  }
}
