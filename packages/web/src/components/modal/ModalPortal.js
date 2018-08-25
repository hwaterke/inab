import PropTypes from 'prop-types'
import React from 'react'

/**
 * This is the basic presentation for a modal.
 * It should never be used alone.
 * The Modal component renders this in a modal div using a react portal
 */
export class ModalPortal extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onCloseRequested: PropTypes.func,
    disableBackgroundClose: PropTypes.bool,
    disableCloseButton: PropTypes.bool,
  }

  static defaultProps = {
    onCloseRequested: null,
    disableBackgroundClose: false,
    disableCloseButton: false,
  }

  render() {
    const {
      children,
      onCloseRequested,
      disableBackgroundClose,
      disableCloseButton,
    } = this.props

    return (
      <div className="modal is-active">
        <div
          className="modal-background"
          onClick={disableBackgroundClose ? null : onCloseRequested}
        />
        <div className="modal-content">{children}</div>
        {disableCloseButton || (
          <button
            onClick={onCloseRequested}
            type="button"
            className="modal-close is-large"
            aria-label="close"
          />
        )}
      </div>
    )
  }
}
