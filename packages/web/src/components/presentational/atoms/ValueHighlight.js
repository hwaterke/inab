import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import {colors} from '../../../constants/colors'
import {Text} from './Text'

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
        <Small>
          <Text>{this.props.name}</Text>
        </Small>
        <Value>
          <Text>{this.props.children}</Text>
        </Value>
      </Container>
    )
  }
}
