import {Dialog} from '@headlessui/react'
import {PropsWithChildren} from 'react'
import {Modal} from './Modal.tsx'

type Props = PropsWithChildren<{
  isOpen: boolean
  close: () => void
  title: string
  description: string
  confirmButtonText: string
  onConfirm: () => void
}>

export const AlertModal = ({
  isOpen,
  close,
  title,
  description,
  confirmButtonText,
  onConfirm,
}: Props) => {
  return (
    <Modal isOpen={isOpen} close={close}>
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            {title}
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
          onClick={async () => {
            await onConfirm()
            close()
          }}
        >
          {confirmButtonText}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}
