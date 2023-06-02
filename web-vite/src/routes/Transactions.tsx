import {graphql} from '../gql'
import {useMutation, useQuery} from '@apollo/client'
import {Fragment, useState} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import {PayeeSelect} from '../components/form-elements/PayeeSelect.tsx'
import classNames from 'classnames'
import {CategoryTag} from '../components/CategoryTag.tsx'
import {Pagination} from '../components/Pagination.tsx'
import {ArrowsRightLeftIcon} from '@heroicons/react/20/solid'
import useLocalStorage from 'use-local-storage'
import {ACCOUNTS_LOCAL_STORAGE_KEY} from '../constants.ts'
import {AmountBadge} from '../components/AmountBadge.tsx'

const allTransactionsQueryDocument = graphql(`
  query transactions($pagination: PaginationInput!, $bankAccounts: [ID!]) {
    transactions(pagination: $pagination, bankAccounts: $bankAccounts) {
      items {
        uuid
        date
        time
        amount
        bankAccount {
          uuid
          name
        }
        transferBankAccount {
          uuid
          name
        }
        payee {
          uuid
          name
        }
        items {
          uuid
          isIncome
          reimburse {
            uuid
          }
          category {
            uuid
            name
          }
        }
      }
      totalCount
    }
  }
`)

export const setTransactionPayeeMutationDocument = graphql(`
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

const TransactionRow = ({
  banAccountName,
  transferBankAccountName,
  date,
  time,
  amount,
  payee,
  transactionUuid,
  payeeSelectUuid,
  setPayeeSelectUuid,
  transactionItems,
}: {
  banAccountName: string
  transferBankAccountName: string | null
  date: string
  time: string | null
  amount: number
  payee: {
    uuid: string
    name: string
  } | null
  transactionUuid: string
  payeeSelectUuid: string | null
  setPayeeSelectUuid: (uuid: string | null) => void
  transactionItems: {
    isIncome: boolean
    category: {
      name: string
    } | null
    reimburse?: {
      uuid: string
    } | null
  }[]
}) => {
  const [setPayee] = useMutation(setTransactionPayeeMutationDocument)

  return (
    <tr>
      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
        {banAccountName}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
        {date}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
        {time}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
        {transferBankAccountName ? (
          <div className="flex">
            <ArrowsRightLeftIcon className="h-5 w-5 mr-2 text-gray-400" />
            {transferBankAccountName}
          </div>
        ) : payeeSelectUuid === transactionUuid ? (
          <PayeeSelect
            autoFocus
            openMenuOnFocus
            value={payee?.uuid ?? null}
            onChange={async (payeeUuid) => {
              await setPayee({
                variables: {
                  uuid: transactionUuid,
                  payeeUuid,
                },
              })
              setPayeeSelectUuid(null)
            }}
            onBlur={() => setPayeeSelectUuid(null)}
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
              indicatorsContainer: () => 'p-0 border-red-900 border-1',
              dropdownIndicator: () => 'p-0',
              clearIndicator: () => 'p-0',
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setPayeeSelectUuid(transactionUuid)}
            className={classNames({
              'text-gray-300': payee === null,
            })}
          >
            {payee?.name ?? 'No payee'}
          </button>
        )}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
        {transactionItems.length === 1 && (
          <CategoryTag {...transactionItems[0]} />
        )}
        {transactionItems.length > 1 && 'Multiple'}
      </td>
      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-right">
        <AmountBadge amount={amount} />
      </td>
      <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <Link
          to={`/transactions/${transactionUuid}`}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </Link>
      </td>
    </tr>
  )
}

export const Transactions = () => {
  const [selectOpened, setSelectOpened] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') ?? '100', 10)
  const [accounts] = useLocalStorage<string[]>(ACCOUNTS_LOCAL_STORAGE_KEY, [])

  const {data} = useQuery(allTransactionsQueryDocument, {
    variables: {
      pagination: {
        page: currentPage,
        pageSize,
      },
      bankAccounts: accounts.length > 0 ? accounts : null,
    },
  })

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
          <Pagination
            page={currentPage}
            pageSize={pageSize}
            totalCount={data?.transactions.totalCount ?? 0}
            onPageChange={(page: number) => {
              setSearchParams({page: page.toString()})
            }}
          />

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
                    {data?.transactions.items.map((transaction) => (
                      <Fragment key={transaction.uuid}>
                        {(accounts.length === 0 ||
                          accounts.find(
                            (account) =>
                              account === transaction.bankAccount.uuid
                          )) && (
                          <TransactionRow
                            banAccountName={transaction.bankAccount.name}
                            transferBankAccountName={
                              transaction.transferBankAccount?.name ?? null
                            }
                            date={transaction.date}
                            time={transaction.time}
                            amount={transaction.amount}
                            payeeSelectUuid={selectOpened}
                            setPayeeSelectUuid={setSelectOpened}
                            payee={transaction.payee}
                            transactionItems={transaction.items}
                            transactionUuid={transaction.uuid}
                          />
                        )}

                        {transaction.transferBankAccount &&
                          (accounts.length === 0 ||
                            accounts.find(
                              (account) =>
                                account ===
                                transaction.transferBankAccount?.uuid
                            )) && (
                            <TransactionRow
                              banAccountName={
                                transaction.transferBankAccount.name
                              }
                              transferBankAccountName={
                                transaction.bankAccount.name
                              }
                              date={transaction.date}
                              time={transaction.time}
                              amount={-transaction.amount}
                              payeeSelectUuid={selectOpened}
                              setPayeeSelectUuid={setSelectOpened}
                              payee={null}
                              transactionItems={transaction.items}
                              transactionUuid={transaction.uuid}
                            />
                          )}
                      </Fragment>
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
