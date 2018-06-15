import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {colors} from '../constants/colors'

const Container = styled.div`
  border-bottom: 1px solid ${colors.border};
`

export class ValueHighlight extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <Container className="d-flex flex-column align-items-center my-3 pb-3">
        <small className="text-uppercase mb-2">{this.props.name}</small>
        <div>
          <h3>{this.props.children}</h3>
        </div>
      </Container>
    )
  }
}
