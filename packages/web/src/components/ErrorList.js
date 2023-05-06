import PropTypes from 'prop-types'
import React from 'react'
import {connect} from 'react-redux'
import {dismissErrors} from '../actions/error.js'
import {Section} from './presentational/atoms/Section'

class ErrorDialog extends React.Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string).isRequired,
    dismissErrors: PropTypes.func.isRequired,
  }

  render() {
    if (this.props.errors.length === 0) {
      return null
    }

    return (
      <Section>
        <div className="notification is-danger content">
          <ul>
            {this.props.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>

          <button
            type="button"
            className="delete"
            onClick={this.props.dismissErrors}
          />
        </div>
      </Section>
    )
  }
}

const mapStateToProps = (state) => ({errors: state.errors})
const mapDispatchToProps = (dispatch) => ({
  dismissErrors: () => dispatch(dismissErrors()),
})
export default connect(mapStateToProps, mapDispatchToProps)(ErrorDialog)
