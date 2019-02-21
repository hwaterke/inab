import React from 'react'
import PropTypes from 'prop-types'
import {amountFromCents} from '@inab/shared'
import styled, {css} from 'styled-components'
import {colors} from '../constants/colors'

const AmountSpan = styled.span`
  color: ${props =>
    props.hasBackground
      ? 'white'
      : props.amount === 0
      ? colors.lightText
      : colors.text};

  ${props =>
    props.hasBackground &&
    css`
      padding: 0.14rem 0.5rem;
      border-radius: 1rem;
      font-weight: bold;

      background-color: ${props.isGoal
        ? colors.yellow
        : props.amount === 0
        ? colors.lightText
        : props.amount > 0
        ? colors.green
        : colors.red};
    `};
`

export class Amount extends React.Component {
  static propTypes = {
    amount: PropTypes.number,
    hasBackground: PropTypes.bool,
    isGoal: PropTypes.bool,
  }

  static defaultProps = {
    amount: 0,
  }

  render() {
    const {amount, hasBackground, isGoal} = this.props

    return (
      <AmountSpan amount={amount} hasBackground={hasBackground} isGoal={isGoal}>
        {amountFromCents(amount).toLocaleString(undefined, {
          style: 'currency',
          currency: 'EUR',
        })}
      </AmountSpan>
    )
  }
}
