import {FormProvider, useForm} from 'react-hook-form'
import {Modal} from './Modal.tsx'
import {Dialog} from '@headlessui/react'
import {Input} from './form-elements/Input.tsx'
import {ModalButtonsSubmit} from './ModalButtonsSubmit.tsx'

type Props = {
  onSubmit: (data: FormData) => void
  defaultValues?: FormData
  isOpen: boolean
  close: () => void
}

type FormData = {
  name: string
  iban: string
}

export const AccountModalForm = ({
  defaultValues,
  onSubmit,
  isOpen,
  close,
}: Props) => {
  const methods = useForm<FormData>({
    defaultValues,
  })

  return (
    <Modal isOpen={isOpen} close={close}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(async (data) => {
            await onSubmit(data)
            close()
          })}
        >
          <div>
            <div className="mt-3 sm:mt-5">
              <Dialog.Title
                as="h3"
                className="text-base text-center font-semibold leading-6 text-gray-900"
              >
                Account
              </Dialog.Title>
              <div className="mt-2 space-y-6">
                <Input<FormData> label="Name" name="name" placeholder="ING" />
                <Input<FormData> label="IBAN" name="iban" placeholder="BEXXX" />
              </div>
            </div>
          </div>
          <ModalButtonsSubmit onClose={close} />
        </form>
      </FormProvider>
    </Modal>
  )
}
