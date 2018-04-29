import React from 'react'
import PropTypes from 'prop-types'
import ButtonCheck from '../ButtonCheck'
import ButtonIcon from '../ButtonIcon'
import ButtonDelete from '../ButtonDelete'

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
      <div className="btn-group">
        <ButtonCheck onClick={this.props.handleSubmit}>
          {this.props.isUpdate ? 'Update' : 'Create'}
        </ButtonCheck>

        <ButtonIcon
          onClick={this.props.reset}
          icon="undo"
          disabled={this.props.disableReset}
        >
          Reset
        </ButtonIcon>

        {this.props.cancel && (
          <ButtonIcon onClick={this.props.cancel} icon="close">
            Cancel
          </ButtonIcon>
        )}

        {this.props.isUpdate &&
          this.props.remove && (
            <ButtonDelete onClick={this.props.remove}>Delete</ButtonDelete>
          )}
      </div>
    )
  }
}
