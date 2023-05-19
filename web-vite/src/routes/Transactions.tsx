import {graphql} from '../gql'
import {useMutation, useQuery} from '@apollo/client'
import {useMemo, useState} from 'react'
import Select from 'react-select'
import {allPayeesQueryDocument} from './Payees.tsx'

const formater = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

const allTransactionsQueryDocument = graphql(`
  query transactions {
    transactions {
      uuid
      date
      time
      amount
      bankAccount {
        uuid
        name
      }
      payee {
        uuid
        name
      }
    }
  }
`)

const setTransactionPayeeMutationDocument = graphql(`
  mutation setBankTransactionPayee($uuid: ID!, $payeeUuid: ID) {
    setBankTransactionPayee(bankTransactionUuid: $uuid, payeeUuid: $payeeUuid) {
      uuid
      date
      time
      amount
      bankAccount {
        uuid
        name
      }
      payee {
        uuid
        name
      }
    }
  }
`)

export const Transactions = () => {
  const [selectOpened, setSelectOpened] = useState<string | null>(null)

  const {data} = useQuery(allTransactionsQueryDocument)
  const {data: payeeData} = useQuery(allPayeesQueryDocument)
  const [setPayee] = useMutation(setTransactionPayeeMutationDocument)

  const payeeOptions = useMemo(
    () =>
      payeeData?.payees.map((payee) => ({
        value: payee.uuid,
        label: payee.name,
      })) ?? [],

    [payeeData]
  )

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <h1 className="text-2xl font-bold leading-7 text-gray-900">
              Transactions
            </h1>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Account
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Time
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Payee
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-2 py-3.5 text-right text-sm font-semibold text-gray-900"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data?.transactions.map((transaction) => (
                      <tr key={transaction.uuid}>
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                          {transaction.bankAccount.name}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                          {transaction.date}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                          {transaction.time}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                          {selectOpened === transaction.uuid ? (
                            <Select
                              autoFocus
                              openMenuOnFocus
                              options={payeeOptions}
                              value={payeeOptions.find(
                                (option) =>
                                  option.value === transaction.payee?.uuid
                              )}
                              onChange={async (option) => {
                                await setPayee({
                                  variables: {
                                    uuid: transaction.uuid,
                                    payeeUuid: option?.value ?? null,
                                  },
                                })

                                setSelectOpened(null)
                              }}
                              isClearable
                              onBlur={() => setSelectOpened(null)}
                              styles={{
                                input: (provided) => ({
                                  ...provided,
                                  '& input': {
                                    boxShadow: 'none!important',
                                    outline: 'none!important',
                                    fontSize: 14,
                                  },
                                }),
                              }}
                              classNames={{
                                control: () => 'min-h-0 border-0 shadow-none',
                                valueContainer: () => 'p-0',
                                input: () => 'p-0 m-0 text-sm',
                                indicatorsContainer: () =>
                                  'p-0 border-red-900 border-1',
                                dropdownIndicator: () => 'p-0',
                                clearIndicator: () => 'p-0',
                              }}
                            />
                          ) : (
                            <button
                              onClick={() => setSelectOpened(transaction.uuid)}
                            >
                              {transaction.payee?.name ?? 'No payee'}
                            </button>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500" />
                        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-right">
                          {formater.format(transaction.amount / 100)}
                        </td>
                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                            <span className="sr-only">
                              , {transaction.uuid}
                            </span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
