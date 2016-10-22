import React from 'react';
import Button from '../Button';
import AccountForm from './AccountForm';
import ui from 'redux-ui';
import Dialog from 'material-ui/Dialog';
import { getAccountsById } from '../../selectors/accounts';
import { connect } from 'react-redux';

@ui()
class AccountFormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenNew = this.handleOpenNew.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
    accountsById: React.PropTypes.instanceOf(Map).isRequired
  };

  handleOpenNew() {
    this.props.updateUI({
      accountFormOpen: true,
      accountSelected: null
    });
  }

  handleClose() {
    this.props.updateUI('accountFormOpen', false);
  }

  render() {
    const closeButton = <Button onClick={this.handleClose}>Close</Button>;
    return (
      <Dialog
        title="Account"
        modal={false}
        actions={[closeButton]}
        open={this.props.ui.accountFormOpen}
        onRequestClose={this.handleClose}>
        <AccountForm
          account={this.props.ui.accountSelected && this.props.accountsById.get(this.props.ui.accountSelected)}
          postSubmit={this.handleClose} />
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  accountsById: getAccountsById(state)
});

export default connect(mapStateToProps)(AccountFormDialog);
