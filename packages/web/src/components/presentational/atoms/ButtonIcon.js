import PropTypes from 'prop-types'
import React from 'react'
import FontAwesome from 'react-fontawesome'
import {Button} from './Button'

export const ButtonIcon = ({icon, children, ...rest}) => (
  <Button {...rest}>
    <span className="icon">
      <FontAwesome name={icon} fixedWidth={!children} />
    </span>
    {children && <span>{children}</span>}
  </Button>
)

ButtonIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  children: PropTypes.node,
}
