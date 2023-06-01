import {graphql} from '../gql'
import {useMutation, useQuery} from '@apollo/client'
import {AccountModalForm} from '../components/AccountModalForm.tsx'
import {useState} from 'react'
import {PrimaryButtonClassnames} from '../tailwind-utils.ts'
import {AlertModal} from '../components/AlertModal.tsx'
import {AccountList} from '../components/AccountList.tsx'

export const allAccountsQueryDocument = graphql(`
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
    <>
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

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <h1 className="text-2xl font-bold leading-7 text-gray-900">
              Accounts
            </h1>

            <button
              type="button"
              onClick={() => setEditingUuid('new')}
              className={PrimaryButtonClassnames}
            >
              Add account
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg ring-1 ring-slate-900/10 px-4 py-12 sm:px-6 lg:px-8">
            {data && (
              <AccountList
                accounts={data.accounts}
                onEdit={(uuid) => setEditingUuid(uuid)}
                onDelete={(uuid) => setConfirmDeleteUuid(uuid)}
              />
            )}
          </div>
        </div>
      </main>
    </>
  )
}
