import {Menu, Transition} from '@headlessui/react'
import {EllipsisVerticalIcon} from '@heroicons/react/20/solid'
import {Fragment} from 'react'
import classNames from 'classnames'

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
            <Menu as="div" className="relative flex-none">
              <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-50"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({active}) => (
                      <button
                        onClick={() => onEdit(account.uuid)}
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block text-left w-full px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({active}) => (
                      <button
                        onClick={() => onDelete(account.uuid)}
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block text-left w-full px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  )
}
