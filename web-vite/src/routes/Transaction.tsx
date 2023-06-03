import {Link, useParams} from 'react-router-dom'
import {graphql} from '../gql'
import {useMutation, useQuery} from '@apollo/client'
import {amountFormatter} from '../utils/formatter.ts'
import {
  formDataToResource,
  resourceToFormData,
  TransactionItemForm,
} from '../components/TransactionItemForm.tsx'
import {useState} from 'react'
import {ChevronRightIcon} from '@heroicons/react/20/solid'
import {MenuOptions} from '../components/MenuOptions.tsx'
import {AlertModal} from '../components/AlertModal.tsx'
import {CategoryTag} from '../components/CategoryTag.tsx'
import {PayeeSelect} from '../components/form-elements/PayeeSelect.tsx'
import {setTransactionPayeeMutationDocument} from './Transactions.tsx'
import classNames from 'classnames'
import {AmountBadge} from '../components/AmountBadge.tsx'

const transactionQueryDocument = graphql(`
  query transaction($uuid: ID!) {
    transaction(uuid: $uuid) {
      uuid
      date
      time
      amount
      hash
      importDetails
      items {
        uuid
        amount
        description
        category {
          uuid
          name
        }
        isIncome
        isCredit
        reimburse {
          uuid
          amount
          isIncome
          category {
            uuid
            name
          }
          transaction {
            uuid
            date
          }
        }
        reimbursedBy {
          uuid
          amount
          isIncome
          category {
            uuid
            name
          }
          transaction {
            uuid
            date
          }
        }
      }
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

const addTransactionItemMutationDocument = graphql(`
  mutation addTransactionItem(
    $bankTransactionUuid: ID!
    $item: BankTransactionItemInputType!
  ) {
    addTransactionItem(bankTransactionUuid: $bankTransactionUuid, item: $item) {
      uuid
    }
  }
`)

const updateTransactionItemMutationDocument = graphql(`
  mutation updateTransactionItem(
    $bankTransactionUuid: ID!
    $uuid: ID!
    $item: BankTransactionItemInputType!
  ) {
    updateTransactionItem(
      bankTransactionUuid: $bankTransactionUuid
      itemUuid: $uuid
      item: $item
    ) {
      uuid
    }
  }
`)

const deleteTransactionItemMutationDocument = graphql(`
  mutation deleteTransactionItem($bankTransactionUuid: ID!, $uuid: ID!) {
    deleteTransactionItem(
      bankTransactionUuid: $bankTransactionUuid
      itemUuid: $uuid
    ) {
      uuid
    }
  }
`)

const ItemListCardDetails = ({
  title,
  items,
}: {
  title: string
  items: {
    uuid: string
    amount: number
    isIncome: boolean
    category: {
      name: string
    } | null
    transaction: {
      uuid: string
      date: string
    }
  }[]
}) => {
  return (
    <div className="w-full flex-none gap-x-4 border-t border-gray-900/5 p-6">
      <div className="text-sm font-semibold leading-6 text-gray-900">
        {title}
      </div>

      {items.map((item) => (
        <Link
          key={item.uuid}
          to={`/transactions/${item.transaction.uuid}`}
          className="mt-1 flex justify-between"
        >
          <div>
            <span className="text-gray-500 pr-3">{item.transaction.date}</span>
            <span>{amountFormatter.format(item.amount / 100)}</span>
          </div>

          <div className="flex">
            <CategoryTag {...item} />
            <ChevronRightIcon className="ml-2 h-6 w-5 text-gray-900" />
          </div>
        </Link>
      ))}
    </div>
  )
}

const ItemCard = ({
  item,
  onEdit,
  onDelete,
}: {
  item: {
    amount: number
    description: string | null
    isIncome: boolean
    isCredit: boolean
    category: {name: string} | null
    reimburse: {
      uuid: string
      amount: number
      isIncome: boolean
      category: {name: string} | null
      transaction: {
        uuid: string
        date: string
      }
    } | null
    reimbursedBy: {
      uuid: string
      amount: number
      isIncome: boolean
      category: {name: string} | null
      transaction: {
        uuid: string
        date: string
      }
    }[]
  }
  onEdit: () => void
  onDelete: () => void
}) => {
  return (
    <li className="max-w-md rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
      <div className="p-6">
        <div className="text-grey-700 text-sm font-semibold leading-6">
          Amount
        </div>
        <div className="mt-1 flex justify-between items-center">
          <span className="text-base font-semibold leading-6 text-gray-900">
            {amountFormatter.format(item.amount / 100)}
          </span>
          <div className="flex items-center">
            <CategoryTag {...item} />
            <MenuOptions
              options={[
                {label: 'Edit', onClick: onEdit},
                {
                  label: 'Delete',
                  onClick: onDelete,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {item.reimburse && (
        <ItemListCardDetails title="Reimburses" items={[item.reimburse]} />
      )}

      {item.reimbursedBy.length > 0 && (
        <ItemListCardDetails title="Reimbursed by" items={item.reimbursedBy} />
      )}

      {item.description && (
        <div className="border-t border-gray-900/5 p-6">
          <div className="text-grey-700 text-sm font-semibold leading-6">
            Description
          </div>
          <span className="text-gray-500 text-sm">{item.description}</span>
        </div>
      )}

      {item.isCredit && (
        <div className="bg-yellow-50 border-t border-gray-900/5 p-6">
          <span className="text-yellow-700 text-sm font-semibold leading-6">
            This item should be reimbursed.
          </span>
        </div>
      )}
    </li>
  )
}

const MissingItemsCard = ({
  amount,
  onAdd,
}: {
  amount: number
  onAdd: () => void
}) => {
  return (
    <div className="rounded-md bg-yellow-50 p-4 mb-4">
      <div className="ml-3">
        <h3 className="text-sm font-medium text-yellow-800">Missing amount</h3>
        <div className="mt-2 text-sm text-yellow-700">
          <p>
            {amountFormatter.format(amount / 100)} is missing from the items
            defined below.
          </p>
        </div>

        <div className="mt-4">
          <div className="-mx-2 -my-1.5 flex">
            <button
              type="button"
              onClick={onAdd}
              className="rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
            >
              Add item
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Transaction = () => {
  const {uuid} = useParams()
  const {data} = useQuery(transactionQueryDocument, {variables: {uuid: uuid!}})
  const [addItem] = useMutation(addTransactionItemMutationDocument, {
    refetchQueries: ['transaction'],
  })
  const [updateItem] = useMutation(updateTransactionItemMutationDocument, {
    refetchQueries: ['transaction'],
  })
  const [deleteItem] = useMutation(deleteTransactionItemMutationDocument, {
    refetchQueries: ['transaction'],
  })
  const [setPayee] = useMutation(setTransactionPayeeMutationDocument)
  const [payeeSelectOpened, setPayeeSelectOpened] = useState(false)

  const [showImportDetails, setShowImportDetails] = useState(false)
  const [editingItemUuid, setEditingItemUuid] = useState<'new' | string | null>(
    null
  )
  const [confirmDeleteItemUuid, setConfirmDeleteItemUuid] = useState<
    string | null
  >(null)

  const editingItem =
    data?.transaction.items.find((item) => item.uuid === editingItemUuid) ??
    null

  const missingAmount = data
    ? data.transaction.amount -
      data.transaction.items.reduce((acc, item) => acc + item.amount, 0)
    : 0

  return (
    <>
      <main className="mx-auto max-w-6xl">
        <div className="bg-white shadow sm:rounded-lg my-4">
          <div className="px-4 py-6 sm:px-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Transaction Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Details and categorisation of the transaction.
            </p>
          </div>
          <div className="border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Date</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {data?.transaction.date}
                  {data?.transaction.time !== undefined &&
                    `, ${data.transaction.time}`}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Amount</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {data?.transaction.amount !== undefined && (
                    <AmountBadge amount={data.transaction.amount} />
                  )}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">
                  Bank account
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {data?.transaction.bankAccount?.name}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Payee</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {payeeSelectOpened ? (
                    <PayeeSelect
                      autoFocus
                      openMenuOnFocus
                      onBlur={() => setPayeeSelectOpened(false)}
                      value={data?.transaction.payee?.uuid ?? null}
                      onChange={async (payeeUuid) => {
                        await setPayee({
                          variables: {uuid: uuid!, payeeUuid},
                        })
                        setPayeeSelectOpened(false)
                      }}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPayeeSelectOpened(true)}
                      className={classNames({
                        'text-gray-400':
                          data?.transaction.payee?.uuid === undefined,
                      })}
                    >
                      {data?.transaction.payee?.name ?? 'Select payee'}
                    </button>
                  )}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">
                  Import hash
                </dt>
                <dd className="mt-1 text-sm leading-6 font-mono text-gray-700 sm:col-span-2 sm:mt-0">
                  {data?.transaction.hash}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">
                  Import details
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    type="button"
                    onClick={() => setShowImportDetails(!showImportDetails)}
                  >
                    Toggle
                  </button>

                  {showImportDetails && (
                    <pre className="mt-2 text-sm font-mono whitespace-pre-line">
                      {JSON.stringify(
                        JSON.parse(data?.transaction.importDetails ?? '{}'),
                        null,
                        2
                      )}
                    </pre>
                  )}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-900">Items</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {missingAmount !== 0 && (
                    <MissingItemsCard
                      amount={missingAmount}
                      onAdd={() => setEditingItemUuid('new')}
                    />
                  )}

                  {confirmDeleteItemUuid !== null && (
                    <AlertModal
                      isOpen
                      close={() => setConfirmDeleteItemUuid(null)}
                      title="Delete item"
                      description={`Are you sure you want to delete this item? This action cannot be undone.`}
                      confirmButtonText={`Delete`}
                      onConfirm={async () => {
                        if (setConfirmDeleteItemUuid !== null) {
                          return await deleteItem({
                            variables: {
                              uuid: confirmDeleteItemUuid,
                              bankTransactionUuid: uuid!,
                            },
                          })
                        }
                      }}
                    />
                  )}

                  {editingItemUuid !== null && (
                    <div className="mb-4">
                      <TransactionItemForm
                        totalAmount={data?.transaction.amount ?? 0}
                        remainingAmount={missingAmount}
                        onSubmit={async (data) => {
                          const itemData = formDataToResource(data)

                          if (editingItemUuid === 'new') {
                            await addItem({
                              variables: {
                                bankTransactionUuid: uuid!,
                                item: itemData,
                              },
                            })
                          } else {
                            await updateItem({
                              variables: {
                                uuid: editingItemUuid,
                                bankTransactionUuid: uuid!,
                                item: itemData,
                              },
                            })
                          }
                          setEditingItemUuid(null)
                        }}
                        defaultValues={
                          editingItemUuid === 'new'
                            ? {
                                amount: missingAmount.toString(),
                                categoryUuid: null,
                                reimburseUuid: null,
                                isCredit: false,
                                description: '',
                              }
                            : resourceToFormData(editingItem!)
                        }
                        onClose={() => setEditingItemUuid(null)}
                      />
                    </div>
                  )}

                  {data && data.transaction.items.length > 0 && (
                    <ul className="flex flex-col gap-y-4">
                      {data?.transaction.items.map((item) => (
                        <ItemCard
                          key={item.uuid}
                          item={item}
                          onEdit={() => setEditingItemUuid(item.uuid)}
                          onDelete={() => setConfirmDeleteItemUuid(item.uuid)}
                        />
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </>
  )
}
