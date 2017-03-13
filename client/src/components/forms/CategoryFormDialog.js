import React from 'react';
import Button from '../Button';
import CategoryForm from './CategoryForm';
import ui from 'redux-ui';
import Dialog from 'material-ui/Dialog';
import {connect} from 'react-redux';
import ButtonIcon from '../ButtonIcon';
import {selectCategoriesById} from '../../selectors/resources';
import {CategoryResource} from '../../entities/Category';

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
    categoriesById: React.PropTypes.objectOf(CategoryResource.propType).isRequired
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
        <ButtonIcon className="btn btn-info" onClick={this.handleOpenNew} icon="plus">
            Category
        </ButtonIcon>
        <Dialog
          title="Category group"
          modal={false}
          actions={[closeButton]}
          open={this.props.ui.categoryFormOpen}
          onRequestClose={this.handleClose}
        >
          <CategoryForm
            updatedResource={this.props.ui.categorySelected && this.props.categoriesById[this.props.ui.categorySelected]}
            postSubmit={this.handleClose}
          />
        </Dialog>
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  categoriesById: selectCategoriesById(state)
});

export default connect(mapStateToProps)(CategoryFormDialog);
