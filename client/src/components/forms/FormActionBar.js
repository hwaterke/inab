// @flow
import React from 'react';
import ButtonCheck from '../ButtonCheck';
import ButtonIcon from '../ButtonIcon';
import ButtonDelete from '../ButtonDelete';

export class FormActionBar extends React.Component {
  static propTypes = {
    isCreate: React.PropTypes.bool.isRequired,
    isUpdate: React.PropTypes.bool.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    disableReset: React.PropTypes.bool,
    reset: React.PropTypes.func.isRequired,
    cancel: React.PropTypes.func,
    remove: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="btn-group">
        <ButtonCheck onClick={this.props.handleSubmit}>
          {this.props.isUpdate ? 'Update' : 'Create'}
        </ButtonCheck>

        <ButtonIcon onClick={this.props.reset} icon="undo" disabled={this.props.disableReset}>
          Reset
        </ButtonIcon>

        {
          this.props.cancel &&
          <ButtonIcon onClick={this.props.cancel} icon="close">
            Cancel
          </ButtonIcon>
        }

        {
          this.props.isUpdate &&
          <ButtonDelete onClick={this.props.remove}>
            Delete
          </ButtonDelete>
        }

      </div>
    );
  }
}
