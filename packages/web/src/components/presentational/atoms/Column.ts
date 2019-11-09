import styled from 'styled-components'
import {themeProps} from '../../../styles/themes'

export const Column = styled.div.attrs(() => ({
  className: 'column',
}))<themeProps>`
  background-color: ${props => props.theme.colors.containers};
`
