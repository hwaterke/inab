import React from 'react'
import PropTypes from 'prop-types'
import {Amount} from './Amount'
import styled from 'styled-components'
import {paddingHorizontal, paddingVertical} from '../styles/styleUtils'

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
