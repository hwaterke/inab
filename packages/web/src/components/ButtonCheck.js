import React from 'react'
import PropTypes from 'prop-types'
import ButtonIcon from './ButtonIcon'

const ButtonCheck = ({onClick, children}) => (
  <ButtonIcon className="btn btn-primary" onClick={onClick} icon="check">
    {children}
  </ButtonIcon>
)

ButtonCheck.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
}

export default ButtonCheck
