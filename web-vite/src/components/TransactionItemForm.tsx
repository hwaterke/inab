import {Controller, FormProvider, useForm} from 'react-hook-form'
import {Input} from './form-elements/Input.tsx'
import {CategorySelect} from './form-elements/CategorySelect.tsx'
import {BankTransactionItemSelect} from './form-elements/BankTransactionItemSelect.tsx'
import {ModalButtonsSubmit} from './ModalButtonsSubmit.tsx'
import {MenuOptions} from './MenuOptions.tsx'

type FormData = {
  amount: string
  categoryUuid: string | null
  isCredit: boolean
  reimburseUuid: string | null
  description: string
}

type Props = {
  onSubmit: (data: FormData) => void
  defaultValues?: FormData
  onClose: () => void
  totalAmount: number
  remainingAmount: number
}

export const resourceToFormData = (resource: {
  amount: number
  category: {uuid: string} | null
  isIncome: boolean
  isCredit: boolean
  reimburse: {uuid: string} | null
  description: string | null
}): FormData => {
  return {
    amount: resource.amount.toString(),
    isCredit: resource.isCredit,
    categoryUuid:
      resource.category?.uuid ??
      (resource.isIncome ? 'income' : 'reimbursement'),
    reimburseUuid: resource.reimburse?.uuid ?? null,
    description: resource.description ?? '',
  }
}

export const formDataToResource = (data: FormData) => {
  return {
    amount: parseInt(data.amount, 10),
    isCredit: data.isCredit,
    isIncome: data.categoryUuid === 'income',
    categoryUuid: data.categoryUuid
      ? ['income', 'reimbursement'].includes(data.categoryUuid)
        ? null
        : data.categoryUuid
      : null,
    reimburseUuid: data.reimburseUuid,
    description: data.description.trim() || null,
  }
}

export const TransactionItemForm = ({
  defaultValues,
  onSubmit,
  onClose,
  totalAmount,
  remainingAmount,
}: Props) => {
  const methods = useForm<FormData>({
    defaultValues,
  })

  return (
    <div className="max-w-lg p-6 mt-6 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Amount
              </label>

              <div className="mt-2 flex items-center space-x-2">
                <input
                  type="number"
                  id="amount"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="100"
                  {...methods.register('amount', {required: true})}
                />

                <MenuOptions
                  options={[
                    {
                      label: 'Remaining',
                      onClick: () => {
                        methods.setValue('amount', remainingAmount.toString())
                      },
                    },
                    {
                      label: '50%',
                      onClick: () => {
                        methods.setValue(
                          'amount',
                          Math.floor(totalAmount / 2).toString()
                        )
                      },
                    },
                    {
                      label: '33%',
                      onClick: () => {
                        methods.setValue(
                          'amount',
                          Math.floor(totalAmount / 3).toString()
                        )
                      },
                    },
                    {
                      label: '25%',
                      onClick: () => {
                        methods.setValue(
                          'amount',
                          Math.floor(totalAmount / 4).toString()
                        )
                      },
                    },
                  ]}
                />
              </div>
              {methods.formState.errors.amount && (
                <p className="mt-2 text-sm text-red-600">
                  This field is required
                </p>
              )}
            </div>

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
                      withIncome
                      withReimbursement
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
              label="Description"
              name="description"
              placeholder="Additional information"
              type="textarea"
              required={false}
            />

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

            <ModalButtonsSubmit onClose={onClose} />
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
