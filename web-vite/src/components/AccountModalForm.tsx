import {useForm} from 'react-hook-form'
import {Modal} from './Modal.tsx'
import {Dialog} from '@headlessui/react'

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
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues,
  })

  return (
    <Modal isOpen={isOpen} close={close}>
      <form
        onSubmit={handleSubmit(async (data) => {
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
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="ING"
                    {...register('name', {required: true})}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    This field is required
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="iban"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  IBAN
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="iban"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="BEXXX"
                    {...register('iban', {required: true})}
                  />
                </div>
                {errors.iban && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    This field is required
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
          >
            Save
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={close}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}
