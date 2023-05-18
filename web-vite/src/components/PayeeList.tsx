import {MenuOptions} from './MenuOptions.tsx'

type Props = {
  payees: {uuid: string; name: string}[]
  onEdit: (uuid: string) => void
  onDelete: (uuid: string) => void
}

export const PayeeList = ({payees, onEdit, onDelete}: Props) => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {payees.map((payee) => (
        <li key={payee.uuid} className="flex justify-between gap-x-6 py-5">
          <div className="flex gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {payee.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-6">
            <MenuOptions
              options={[
                {label: 'Edit', onClick: () => onEdit(payee.uuid)},
                {label: 'Delete', onClick: () => onDelete(payee.uuid)},
              ]}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
