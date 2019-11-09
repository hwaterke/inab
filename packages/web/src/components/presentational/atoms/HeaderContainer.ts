import styled from 'styled-components'
import {colors} from '../../../constants/colors'
import {themeProps} from '../../../styles/themes'

export const HeaderContainer = styled.div<{theme: themeProps}>`
  background-color: ${props => props.theme.colors.containers};
  border-bottom: 1px solid ${colors.border};
`
