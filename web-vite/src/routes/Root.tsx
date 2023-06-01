import {Disclosure, Popover} from '@headlessui/react'
import {Bars3Icon, CreditCardIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {NavLink, Outlet} from 'react-router-dom'
import {Fragment} from 'react'
import {useQuery} from '@apollo/client'
import {allAccountsQueryDocument} from './Accounts.tsx'
import useLocalStorage from 'use-local-storage'
import {ACCOUNTS_LOCAL_STORAGE_KEY} from '../constants.ts'

const navigation = [
  {name: 'Home', to: '/'},
  {name: 'Accounts', to: '/accounts'},
  {name: 'Payees', to: '/payees'},
  {name: 'Categories', to: '/categories'},
  {name: 'Transactions', to: '/transactions'},
]

const MobileMenuButton = ({isOpen}: {isOpen: boolean}) => {
  return (
    <div className="-mr-2 flex md:hidden">
      <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        )}
      </Disclosure.Button>
    </div>
  )
}

const MobileMenu = () => {
  return (
    <Disclosure.Panel className="md:hidden">
      <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        {navigation.map((item) => (
          <Disclosure.Button key={item.name} as={Fragment}>
            <NavLink
              to={item.to}
              className={({isActive}) =>
                isActive
                  ? 'block rounded-md px-3 py-2 text-base font-medium bg-gray-900 text-white'
                  : 'block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
              }
            >
              {item.name}
            </NavLink>
          </Disclosure.Button>
        ))}
      </div>
    </Disclosure.Panel>
  )
}

const AccountPopover = () => {
  const {data} = useQuery(allAccountsQueryDocument)
  const [accounts, setAccounts] = useLocalStorage<string[]>(
    ACCOUNTS_LOCAL_STORAGE_KEY,
    []
  )

  return (
    <Popover className="relative">
      <Popover.Button
        type="button"
        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <span className="sr-only">View notifications</span>
        <CreditCardIcon className="h-6 w-6" aria-hidden="true" />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 left-1/2 mt-5 w-44 -translate-x-1/2">
        <div className="flex flex-col rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200">
          {data?.accounts.map((account) => (
            <div key={account.uuid} className="flex items-center px-2">
              <label
                htmlFor={`account-${account.uuid}`}
                className="block min-w-0 text-sm leading-6 flex-1 select-none font-medium text-gray-900 pr-4 py-2"
              >
                {account.name}
              </label>

              <input
                id={`account-${account.uuid}`}
                name={`account-${account.uuid}`}
                type="checkbox"
                checked={accounts.includes(account.uuid)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAccounts([...accounts, account.uuid])
                  } else {
                    setAccounts(
                      accounts.filter((uuid) => uuid !== account.uuid)
                    )
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export const Root = () => {
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({open}) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={({isActive}) =>
                              isActive
                                ? 'rounded-md px-3 py-2 text-sm font-medium bg-gray-900 text-white'
                                : 'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                            }
                          >
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <AccountPopover />
                    </div>
                  </div>

                  <MobileMenuButton isOpen={open} />
                </div>
              </div>

              <MobileMenu />
            </>
          )}
        </Disclosure>

        <Outlet />
      </div>
    </>
  )
}
