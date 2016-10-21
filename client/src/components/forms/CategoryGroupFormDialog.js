import React from 'react';
import Button from '../Button';
import CategoryGroupForm from './CategoryGroupForm';
import FontAwesome from 'react-fontawesome';
import ui from 'redux-ui';
import Dialog from 'material-ui/Dialog';
import { getCategoryGroupsById } from '../../selectors/categoryGroups';
import { connect } from 'react-redux';

@ui()
class CategoryGroupFormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenNew = this.handleOpenNew.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
    categoryGroupsById: React.PropTypes.instanceOf(Map).isRequired
  };

  handleOpenNew() {
    this.props.updateUI({
      formOpen: true,
      categoryGroupSelected: null
    });
  }

  handleClose() {
    this.props.updateUI('formOpen', false);
  }

  render() {
    const closeButton = <Button onClick={this.handleClose}>Close</Button>;
    return (
      <span>
        <Button onClick={this.handleOpenNew}><FontAwesome name='plus' /></Button>
        <Dialog
          title="Category group"
          modal={false}
          actions={[closeButton]}
          open={this.props.ui.formOpen}
          onRequestClose={this.handleClose}>
          <CategoryGroupForm
            categoryGroup={this.props.ui.categoryGroupSelected && this.props.categoryGroupsById.get(this.props.ui.categoryGroupSelected)}
            postSubmit={this.handleClose} />
        </Dialog>
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  categoryGroupsById: getCategoryGroupsById(state)
});

export default connect(mapStateToProps)(CategoryGroupFormDialog);
