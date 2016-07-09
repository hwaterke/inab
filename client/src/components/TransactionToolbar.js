import React from 'react';
import Button from './Button';
import FontAwesome from 'react-fontawesome';

export default class TransactionToolbar extends React.Component {
  render() {
    return (
      <div>
        <h4>Toolbar</h4>
        <Button><FontAwesome name='ban' /></Button>
      </div>
    );
  }
}
