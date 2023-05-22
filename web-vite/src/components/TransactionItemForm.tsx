import {Controller, FormProvider, useForm} from 'react-hook-form'
import {Input} from './Input.tsx'
import {CategorySelect} from './CategorySelect.tsx'
import {BankTransactionItemSelect} from './BankTransactionItemSelect.tsx'

type FormData = {
  amount: string
  categoryUuid: string
  isCredit: boolean
  reimburseUuid?: string
}

type Props = {
  onSubmit: (data: FormData) => void
  defaultValues?: FormData
  onClose?: () => void
}

export const TransactionItemForm = ({
  defaultValues,
  onSubmit,
  onClose,
}: Props) => {
  const methods = useForm<FormData>({
    defaultValues,
  })

  return (
    <div className="max-w-lg p-6 mt-6 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Input<FormData>
              label="Amount"
              name="amount"
              placeholder="100"
              type="number"
            />

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Category
              </label>
              <div className="mt-2">
                <Controller<FormData, 'categoryUuid'>
                  name="categoryUuid"
                  control={methods.control}
                  render={({field}) => (
                    <CategorySelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                  rules={{required: true}}
                />
              </div>
              {methods.formState.errors.categoryUuid && (
                <p className="mt-2 text-sm text-red-600">
                  This field is required
                </p>
              )}
            </div>

            <Input<FormData>
              label="Credit"
              name="isCredit"
              type="checkbox"
              required={false}
            />

            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Reimburses
              </label>
              <div className="mt-2">
                <Controller<FormData, 'reimburseUuid'>
                  name="reimburseUuid"
                  control={methods.control}
                  render={({field}) => (
                    <BankTransactionItemSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
