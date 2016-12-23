import React from "react";
import Button from "../Button";
import CategoryGroupForm from "./CategoryGroupForm";
import ui from "redux-ui";
import Dialog from "material-ui/Dialog";
import {getCategoryGroupsById} from "../../selectors/categoryGroups";
import {connect} from "react-redux";
import ButtonIcon from "../ButtonIcon";

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
          onRequestClose={this.handleClose}>
          <CategoryGroupForm
            categoryGroup={this.props.ui.categoryGroupSelected && this.props.categoryGroupsById.get(this.props.ui.categoryGroupSelected)}
            postSubmit={this.handleClose}/>
        </Dialog>
      </span>
    );
  }
}

const mapStateToProps = (state) => ({
  categoryGroupsById: getCategoryGroupsById(state)
});

export default connect(mapStateToProps)(CategoryGroupFormDialog);
