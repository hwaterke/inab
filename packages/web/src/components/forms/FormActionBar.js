import PropTypes from 'prop-types'
import React from 'react'
import {ButtonIcon} from '../presentational/atoms/ButtonIcon'

export class FormActionBar extends React.Component {
  static propTypes = {
    isUpdate: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    disableReset: PropTypes.bool,
    reset: PropTypes.func.isRequired,
    cancel: PropTypes.func,
    remove: PropTypes.func,
  }

  render() {
    return (
      <div className="buttons has-addons">
        <ButtonIcon
          color="primary"
          onClick={this.props.handleSubmit}
          icon="check"
        >
          {this.props.isUpdate ? 'Update' : 'Create'}
        </ButtonIcon>

        <ButtonIcon
          type="button"
          onClick={this.props.reset}
          icon="undo"
          disabled={this.props.disableReset}
        >
          Reset
        </ButtonIcon>

        {this.props.cancel && (
          <ButtonIcon type="button" onClick={this.props.cancel} icon="close">
            Cancel
          </ButtonIcon>
        )}

        {this.props.isUpdate &&
          this.props.remove && (
            <ButtonIcon
              type="button"
              onClick={this.props.remove}
              color="danger"
              icon="trash"
            >
              Delete
            </ButtonIcon>
          )}
      </div>
    )
  }
}
