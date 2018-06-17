import {css} from 'styled-components'

const DEFAULT_FONT_SIZE = '14'

const mediaSizes = {
  giant: 1170,
  desktop: 992,
  tablet: 768,
  phone: 376,
}

export const media = Object.keys(mediaSizes).reduce((accumulator, label) => {
  // Use em in breakpoints to work properly cross-browser and support users
  // changing their browsers font-size: https://zellwk.com/blog/media-query-units/
  const emSize = mediaSizes[label] / DEFAULT_FONT_SIZE
  accumulator[label] = (...args) => css`
    @media (min-width: ${emSize}em) {
      ${css(...args)};
    }
  `
  return accumulator
}, {})

export const paddingHorizontal = css`
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  ${media.tablet`
    padding-left: 1.4rem;
    padding-right: 1.4rem;
  `};
`

export const paddingVertical = css`
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  ${media.tablet`
    padding-top: 1rem;
    padding-bottom: 1rem;
  `};
`
