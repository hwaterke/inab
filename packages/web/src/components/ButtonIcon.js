import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import FontAwesome from 'react-fontawesome';

const ButtonIcon = ({className, onClick, children, icon, disabled}) => (
  <Button className={className} onClick={onClick} disabled={!!disabled}>
    <FontAwesome name={icon} fixedWidth={!children} />
    {children && '\u00a0'}
    {children}
  </Button>
);

ButtonIcon.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

export default ButtonIcon;
