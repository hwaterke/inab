import classNames from 'classnames'
import PropTypes from 'prop-types'
import styled from 'styled-components'

export const Button = styled.button.attrs((props) => ({
  className: classNames(
    'button',
    {'is-primary': props.color === 'primary'},
    {'is-link': props.color === 'link'},
    {'is-info': props.color === 'info'},
    {'is-success': props.color === 'success'},
    {'is-warning': props.color === 'warning'},
    {'is-danger': props.color === 'danger'},
    {'is-outlined': props.outlined},
    {'is-inverted': props.inverted},
    {'is-small': props.size === 'small'}
  ),
}))`
  ${({isWide}) => isWide && 'width: 100%'};
`

Button.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'link',
    'info',
    'success',
    'warning',
    'danger',
  ]),
  outlined: PropTypes.bool,
  inverted: PropTypes.bool,
  size: PropTypes.string,
}
