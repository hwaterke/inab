import React from 'react'
import PropTypes from 'prop-types'
import './ValueHighlight.scss'

export class ValueHighlight extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <div className="value-highlight-block d-flex flex-column align-items-center my-3 pb-3">
        <small className="text-uppercase mb-2">{this.props.name}</small>
        <div>
          <h3>{this.props.children}</h3>
        </div>
      </div>
    )
  }
}
