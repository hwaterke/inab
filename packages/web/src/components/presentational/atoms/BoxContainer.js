import styled from 'styled-components'
import {colors} from '../../../constants/colors'
import {media} from '../../../styles/styleUtils'

export const BoxContainer = styled.div`
  background-color: ${colors.frontBackground};
  border: 1px solid ${colors.border};
  border-radius: 3px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.8rem;
  ${media.tablet`
    width: 80%;
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding-left: 1.4rem;
    padding-right: 1.4rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  `};
`
