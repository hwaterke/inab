import React from 'react'
import ReactDOM from 'react-dom'
import {ModalPortal} from './ModalPortal'

const modalRoot = document.getElementById('modal-root')

/**
 * This component renders this in a modal div using a react portal
 */
export class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount() {
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(<ModalPortal {...this.props} />, this.el)
  }
}
