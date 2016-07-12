import React from 'react';
import Button from './Button';
import FontAwesome from 'react-fontawesome';
import ui from 'redux-ui';

@ui()
export default class TransactionToolbar extends React.Component {
  static propTypes = {
    ui: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div>
        <h4>Toolbar</h4>
        { this.props.ui.selectedTransactions.size > 0 && <Button><FontAwesome name='ban' /> ({this.props.ui.selectedTransactions.size})</Button> }
      </div>
    );
  }
}
