import React from 'react';
import Button from './Button';
import FontAwesome from 'react-fontawesome';

const ButtonIcon = ({className, onClick, children, icon}) => (
  <Button className={className} onClick={onClick}>
    <FontAwesome name={icon} fixedWidth={!children} />
    {children && '\u00a0'}
    {children}
  </Button>
);

ButtonIcon.propTypes = {
  children: React.PropTypes.node,
  onClick: React.PropTypes.func,
  className: React.PropTypes.string,
  icon: React.PropTypes.string.isRequired
};

export default ButtonIcon;
