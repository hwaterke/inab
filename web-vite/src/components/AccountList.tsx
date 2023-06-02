import {MenuOptions} from './MenuOptions.tsx'

type Props = {
  accounts: {uuid: string; name: string; iban: string}[]
  onEdit: (uuid: string) => void
  onDelete: (uuid: string) => void
}

export const AccountList = ({accounts, onEdit, onDelete}: Props) => {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {accounts.map((account) => (
        <li key={account.uuid} className="flex justify-between gap-x-6 py-5">
          <div className="flex gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {account.name}
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                {account.iban}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-6">
            <MenuOptions
              options={[
                {label: 'Edit', onClick: () => onEdit(account.uuid)},
                {label: 'Delete', onClick: () => onDelete(account.uuid)},
              ]}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}