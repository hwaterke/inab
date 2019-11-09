import styled from 'styled-components'
import {Link as RRLink} from 'react-router-dom'
import {themeProps} from '../../../styles/themes'

export const Link = styled(RRLink)<themeProps>`
  color: ${props => props.theme.colors.primary};

  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`
