import {PropsWithChildren} from 'react'
import {Dialog} from '@headlessui/react'

type Props = PropsWithChildren<{
  isOpen: boolean
  close: () => void
}>

export const Modal = ({isOpen, close, children}: Props) => {
  return (
    <Dialog open={isOpen} onClose={close} as="div" className="relative z-10">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
            {children}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
