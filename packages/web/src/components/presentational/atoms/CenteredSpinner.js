import React from 'react'
import styled from 'styled-components'
import {Spinner} from './Spinner'

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`

export const CenteredSpinner = () => (
  <Container>
    <Spinner />
  </Container>
)
