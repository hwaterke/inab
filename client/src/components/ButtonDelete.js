import React from 'react';
import ButtonIcon from './ButtonIcon';

const ButtonDelete = ({onClick, children}) => (
  <ButtonIcon className="btn btn-danger" onClick={onClick} icon="trash">
    {children}
  </ButtonIcon>
);

ButtonDelete.propTypes = {
  onClick: React.PropTypes.func,
  children: React.PropTypes.node
};

export default ButtonDelete;
