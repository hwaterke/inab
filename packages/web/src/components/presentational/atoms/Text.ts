import styled from 'styled-components'
import {themeProps} from '../../../styles/themes'

export const Text = styled.span<themeProps>`
  color: ${props => props.theme.colors.textPrimary};
`
