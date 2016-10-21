import React from 'react';
import Button from './Button';
import FontAwesome from 'react-fontawesome';

const ButtonDelete = ({onClick}) => (
  <Button className="btn btn-danger" onClick={onClick}>
    <FontAwesome name='trash' />
  </Button>
);

ButtonDelete.propTypes = {
  onClick: React.PropTypes.func
};

export default ButtonDelete;
