import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import CategoryGroupForm from './CategoryGroupForm';
import ui from 'redux-ui';
import Dialog from 'material-ui/Dialog';
import {connect} from 'react-redux';
import ButtonIcon from '../ButtonIcon';
import {CategoryGroupResource} from 'inab-shared/src/entities/CategoryGroup';
import {byIdSelector} from 'hw-react-shared/src/crud/selectors/selectors';

@ui()
class CategoryGroupFormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenNew = this.handleOpenNew.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  static propTypes = {
    ui: PropTypes.object.isRequired,
    updateUI: PropTypes.func.isRequired,
    categoryGroupsById: PropTypes.objectOf(CategoryGroupResource.propType).isRequired
  };

  handleOpenNew() {
    this.props.updateUI({
      categoryGroupFormOpen: true,
      categoryGroupSelected: null
    });
  }

  handleClose() {
    this.props.updateUI('categoryGroupFormOpen', false);
  }

  render() {
    const closeButton = <Button onClick={this.handleClose}>Close</Button>;
    return (
      <span>
        <ButtonIcon className="btn btn-info" onClick={this.handleOpenNew} icon="plus">
          Category Group
        </ButtonIcon>
        <Dialog
          title="Category group"
          modal={false}
          actions={[closeButton]}
          open={this.props.ui.categoryGroupFormOpen}
          onRequestClose={this.handleClose}
        >
          <CategoryGroupForm
            updatedResource={
              this.props.ui.categoryGroupSelected &&
                this.props.categoryGroupsById[this.props.ui.categoryGroupSelected]
            }
            postSubmit={this.handleClose}
          />
        </Dialog>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  categoryGroupsById: byIdSelector(CategoryGroupResource)(state)
});

export default connect(mapStateToProps)(CategoryGroupFormDialog);
