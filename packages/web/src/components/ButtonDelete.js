import React from 'react'
import PropTypes from 'prop-types'
import ButtonIcon from './ButtonIcon'

const ButtonDelete = ({onClick, children}) => (
  <ButtonIcon className="btn btn-danger" onClick={onClick} icon="trash">
    {children}
  </ButtonIcon>
)

ButtonDelete.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
}

export default ButtonDelete
