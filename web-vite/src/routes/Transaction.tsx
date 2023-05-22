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

const transactionQueryDocument = graphql(`
  query transaction($uuid: ID!) {
    transaction(uuid: $uuid) {
      uuid
      date
      time
      amount
      items {
        uuid
        category {
          uuid
          name
        }
        amount
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
      date
      time
      amount
      items {
        uuid
        category {
          uuid
          name
        }
        amount
        isCredit
        reimburse {
          uuid
          amount
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
      date
      time
      amount
      items {
        uuid
        category {
          uuid
          name
        }
        amount
        isCredit
        reimburse {
          uuid
          amount
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

const deleteTransactionItemMutationDocument = graphql(`
  mutation deleteTransactionItem($bankTransactionUuid: ID!, $uuid: ID!) {
    deleteTransactionItem(
      bankTransactionUuid: $bankTransactionUuid
      itemUuid: $uuid
    ) {
      uuid
      date
      time
      amount
      items {
        uuid
        category {
          uuid
          name
        }
        amount
        isCredit
        reimburse {
          uuid
          amount
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
    <li className="max-w-lg rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
      <dl className="flex flex-wrap p-4">
        <div className="flex-auto ">
          <dt className="text-sm font-semibold leading-6 text-gray-900">
            Amount
          </dt>
          <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">
            {amountFormatter.format(item.amount / 100)}
          </dd>
        </div>
        <div className="flex-none self-end pl-6 pt-4">
          <dt className="sr-only">Category</dt>
          <CategoryTag {...item} />
        </div>
        <div className="inline-flex items-center self-end">
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
      </dl>

      {item.reimburse && (
        <ItemListCardDetails title="Reimburses" items={[item.reimburse]} />
      )}

      {item.reimbursedBy.length > 0 && (
        <ItemListCardDetails title="Reimbursed by" items={item.reimbursedBy} />
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
  const [addItem] = useMutation(addTransactionItemMutationDocument)
  const [updateItem] = useMutation(updateTransactionItemMutationDocument)
  const [deleteItem] = useMutation(deleteTransactionItemMutationDocument)

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
                  {data?.transaction.amount !== undefined &&
                    amountFormatter.format(data.transaction.amount / 100)}
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
                  {data?.transaction.payee?.name}
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
