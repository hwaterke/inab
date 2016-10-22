import React from 'react';
import Button from '../Button';
import CategoryForm from './CategoryForm';
import ui from 'redux-ui';
import Dialog from 'material-ui/Dialog';
import FontAwesome from 'react-fontawesome';
import { getCategoriesById } from '../../selectors/categories';
import { connect } from 'react-redux';

@ui()
class CategoryFormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenNew = this.handleOpenNew.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  static propTypes = {
    ui: React.PropTypes.object.isRequired,
    updateUI: React.PropTypes.func.isRequired,
    categoriesById: React.PropTypes.instanceOf(Map).isRequired
  };

  handleOpenNew() {
    this.props.updateUI({
      categoryFormOpen: true,
      categorySelected: null
    });
  }

  handleClose() {
    this.props.updateUI('categoryFormOpen', false);
  }

  render() {
    const closeButton = <Button onClick={this.handleClose}>Close</Button>;
    return (
      <span>
        <Button onClick={this.handleOpenNew}><FontAwesome name='plus' /> Category</Button>
        <Dialog
          title="Category group"
          modal={false}
          actions={[closeButton]}
          open={this.props.ui.categoryFormOpen}
          onRequestClose={this.handleClose}>
          <CategoryForm
            category={this.props.ui.categorySelected && this.props.categoriesById.get(this.props.ui.categorySelected)}
            postSubmit={this.handleClose} />
        </Dialog>
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  categoriesById: getCategoriesById(state)
});

export default connect(mapStateToProps)(CategoryFormDialog);
