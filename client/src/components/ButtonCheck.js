import React from 'react';
import Button from './Button';
import FontAwesome from 'react-fontawesome';

const ButtonCheck = ({onClick}) => (
  <Button className="btn btn-primary" onClick={onClick}>
    <FontAwesome name='check' fixedWidth />
  </Button>
);

ButtonCheck.propTypes = {
  onClick: React.PropTypes.func
};

export default ButtonCheck;
