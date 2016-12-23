import React from 'react';
import ButtonIcon from './ButtonIcon';

const ButtonCheck = ({onClick, children}) => (
  <ButtonIcon className="btn btn-primary" onClick={onClick} icon="check">
    {children}
  </ButtonIcon>
);

ButtonCheck.propTypes = {
  onClick: React.PropTypes.func,
  children: React.PropTypes.node
};

export default ButtonCheck;
