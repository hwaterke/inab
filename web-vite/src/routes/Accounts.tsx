import {graphql} from '../gql'
import {useMutation, useQuery} from '@apollo/client'
import {useTitle} from '../utils/useTitle.ts'
import {AccountModalForm} from '../components/AccountModalForm.tsx'
import {useState} from 'react'
import {
  PrimaryButtonClassnames,
  SecondaryButtonClassnames,
} from '../tailwind-utils.ts'
import {AlertModal} from '../components/AlertModal.tsx'

const allAccountsQueryDocument = graphql(`
  query accounts {
    accounts {
      uuid
      name
      iban
    }
  }
`)

const createAccountMutationDocument = graphql(`
  mutation createAccount($name: String!, $iban: String!) {
    createAccount(name: $name, iban: $iban) {
      uuid
    }
  }
`)

const updateAccountMutationDocument = graphql(`
  mutation updateAccount($uuid: ID!, $name: String!, $iban: String!) {
    updateAccount(uuid: $uuid, name: $name, iban: $iban) {
      uuid
    }
  }
`)

const deleteAccountMutationDocument = graphql(`
  mutation deleteAccount($uuid: ID!) {
    deleteAccount(uuid: $uuid)
  }
`)

export const Accounts = () => {
  useTitle('Accounts')
  const [editingUuid, setEditingUuid] = useState<string | null>(null)
  const [confirmDeleteUuid, setConfirmDeleteUuid] = useState<string | null>(
    null
  )

  const {data} = useQuery(allAccountsQueryDocument)
  const [createAccount] = useMutation(createAccountMutationDocument, {
    refetchQueries: ['accounts'],
  })
  const [updateAccount] = useMutation(updateAccountMutationDocument, {
    refetchQueries: ['accounts'],
  })
  const [deleteAccount] = useMutation(deleteAccountMutationDocument, {
    refetchQueries: ['accounts'],
  })

  return (
    <div>
      <button
        type="button"
        onClick={() => setEditingUuid('new')}
        className={PrimaryButtonClassnames}
      >
        Add account
      </button>

      {confirmDeleteUuid !== null && (
        <AlertModal
          isOpen
          close={() => setConfirmDeleteUuid(null)}
          title={`Delete account ${
            data?.accounts.find((account) => account.uuid === confirmDeleteUuid)
              ?.name
          }?`}
          description={`Are you sure you want to delete this account? This action cannot be undone.`}
          confirmButtonText={`Delete`}
          onConfirm={() => {
            if (confirmDeleteUuid !== null) {
              return deleteAccount({variables: {uuid: confirmDeleteUuid}})
            }
          }}
        />
      )}

      {editingUuid !== null && (
        <AccountModalForm
          onSubmit={(data) => {
            if (editingUuid === 'new') {
              return createAccount({variables: data})
            } else {
              return updateAccount({variables: {...data, uuid: editingUuid}})
            }
          }}
          isOpen
          close={() => setEditingUuid(null)}
          defaultValues={
            editingUuid === 'new'
              ? undefined
              : data?.accounts.find((account) => account.uuid === editingUuid)
          }
        />
      )}

      {data && (
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
        >
          {data.accounts.map((account) => (
            <li
              key={account.uuid}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                <button
                  type="button"
                  className={SecondaryButtonClassnames}
                  onClick={() => setEditingUuid(account.uuid)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className={SecondaryButtonClassnames}
                  onClick={() => setConfirmDeleteUuid(account.uuid)}
                >
                  Delete
                </button>

                {account.name}
                {account.iban}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
