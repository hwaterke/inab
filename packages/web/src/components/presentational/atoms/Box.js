import styled from 'styled-components'

export const Box = styled.div.attrs(() => ({className: 'box'}))`
  background-color: ${props => props.theme.colors.containers};
`
