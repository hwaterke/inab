import React from 'react'

const ligthTheme = {
  colors: {
    background: '#f9f9f9',
    containers: 'white',
    primary: '#3273dc',
    accent: '#73a0e7',
    textPrimary: '#000',
  },
  elements: {
    navbar: {
      className: 'is-white',
      text: 'has-text-dark',
    },
  },
}

const darkTheme: typeof ligthTheme = {
  colors: {
    background: '#2d2d2d',
    containers: '#4a4a4a',
    accent: '#ee9b9b',
    primary: '#d12323',
    textPrimary: '#fff',
  },
  elements: {
    navbar: {
      className: 'is-dark',
      text: 'has-text-white',
    },
  },
}

export type themeProps = {
  theme: typeof ligthTheme
}

export const themes = {
  light: ligthTheme,
  dark: darkTheme,
}

export const ThemeSwitcher = React.createContext(undefined)
