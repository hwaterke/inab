import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import {media, paddingVertical} from '../../../styles/styleUtils'
import {Amount} from '../../Amount'

const Header = styled.div`
  ${paddingVertical} display: flex;
  align-items: center;
  justify-content: center;

  > h1 {
    margin-right: 2rem;
  }

  ${media.tablet`
    justify-content: flex-start;
  `};
`

export const AccountHeader = ({name, balance}) => (
  <div className="full-header-container">
    <div className="container">
      <div className="row">
        <div className="col">
          <Header>
            <h1>{name}</h1>
            <div>
              <Amount amount={balance} hasBackground />
            </div>
          </Header>
        </div>
      </div>
    </div>
  </div>
)

AccountHeader.propTypes = {
  name: PropTypes.string,
  balance: PropTypes.number,
}
