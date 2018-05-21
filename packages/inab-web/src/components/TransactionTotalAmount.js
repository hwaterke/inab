import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {paddingHorizontal, paddingVertical} from '../styles/styleUtils'
import {Amount} from './Amount'

const Container = styled.div`
  ${paddingHorizontal} ${paddingVertical}
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const Total = styled.span`
  padding-right: 0.8rem;
`

export const TransactionTotalAmount = ({amount}) => {
  return (
    <Container>
      <Total>Total</Total>
      <Amount amount={amount} hasBackground />
    </Container>
  )
}

TransactionTotalAmount.propTypes = {
  amount: PropTypes.number,
}
