import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import AccountForm from './AccountForm';
import ui from 'redux-ui';
import Dialog from 'material-ui/Dialog';
import {connect} from 'react-redux';
import {AccountResource} from 'inab-shared/src/entities/Account';
import {byIdSelector} from 'hw-react-shared/src/crud/selectors/selectors';

@ui()
class AccountFormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenNew = this.handleOpenNew.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  static propTypes = {
    ui: PropTypes.object.isRequired,
    updateUI: PropTypes.func.isRequired,
    accountsById: PropTypes.objectOf(AccountResource.propType).isRequired
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
        onRequestClose={this.handleClose}
      >
        <AccountForm
          updatedResource={
            this.props.ui.accountSelected && this.props.accountsById[this.props.ui.accountSelected]
          }
          postSubmit={this.handleClose}
        />
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  accountsById: byIdSelector(AccountResource)(state)
});

export default connect(mapStateToProps)(AccountFormDialog);
