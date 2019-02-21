import {selectBackend, selectToken} from '@inab/shared'
import axios from 'axios'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {path} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {Button} from '../../presentational/atoms/Button'
import {CenteredSpinner} from '../../presentational/atoms/CenteredSpinner'
import {Section} from '../../presentational/atoms/Section'
import {Title} from '../../presentational/atoms/Title'
import {Box} from '../../presentational/atoms/Box'

const mapStateToProps = state => ({
  backend: selectBackend(state),
  token: selectToken(state),
})

export const AdminPage = connect(mapStateToProps)(
  class AdminPage extends React.Component {
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
        <Section>
          <div className="columns is-centered">
            <div className="column is-half">
              <Box>
                <Title>Administration</Title>

                {this.state.loading ? (
                  <CenteredSpinner />
                ) : (
                  <div
                    className={classNames(
                      'notification',
                      {'is-success': this.state.registration},
                      {'is-danger': !this.state.registration}
                    )}
                  >
                    {this.state.registration
                      ? 'Registrations are open'
                      : 'Registrations are closed'}
                  </div>
                )}

                {!this.state.loading && (
                  <Button onClick={this.toggleRegistration}>
                    Toggle registration
                  </Button>
                )}
              </Box>
            </div>
          </div>
        </Section>
      )
    }
  }
)
