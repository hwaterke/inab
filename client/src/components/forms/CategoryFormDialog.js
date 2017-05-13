import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import CategoryForm from './CategoryForm';
import ui from 'redux-ui';
import Dialog from 'material-ui/Dialog';
import {connect} from 'react-redux';
import ButtonIcon from '../ButtonIcon';
import {CategoryResource} from 'inab-shared/src/entities/Category';
import {byIdSelector} from 'hw-react-shared/src/crud/selectors/selectors';

@ui()
class CategoryFormDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleOpenNew = this.handleOpenNew.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  static propTypes = {
    ui: PropTypes.object.isRequired,
    updateUI: PropTypes.func.isRequired,
    categoriesById: PropTypes.objectOf(CategoryResource.propType).isRequired
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
            updatedResource={
              this.props.ui.categorySelected &&
                this.props.categoriesById[this.props.ui.categorySelected]
            }
            postSubmit={this.handleClose}
          />
        </Dialog>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  categoriesById: byIdSelector(CategoryResource)(state)
});

export default connect(mapStateToProps)(CategoryFormDialog);
