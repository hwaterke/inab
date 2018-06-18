import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import {colors} from '../../../constants/colors'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.border};
`

const Small = styled.small`
  text-transform: uppercase;
  margin-bottom: 0.2rem;
`

const Value = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
`

export class ValueHighlight extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <Container>
        <Small>{this.props.name}</Small>
        <Value>{this.props.children}</Value>
      </Container>
    )
  }
}
