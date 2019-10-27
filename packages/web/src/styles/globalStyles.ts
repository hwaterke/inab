import {createGlobalStyle} from 'styled-components'
import {themeProps} from './themes'

export const GlobalStyles = createGlobalStyle`
  html {
    font-size: 14px;
  }

  body {
    background-color: ${(props: themeProps) => props.theme.colors.background};
  }

  #root {
    min-height: 100vh;
  }
`
