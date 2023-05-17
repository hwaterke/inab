import {graphql} from '../gql'
import {useMutation, useQuery} from '@apollo/client'
import {useTitle} from '../utils/useTitle.ts'
import {AccountModalForm} from '../components/AccountModalForm.tsx'
import {useState} from 'react'
import {PrimaryButtonClassnames} from '../tailwind-utils.ts'
import {AlertModal} from '../components/AlertModal.tsx'
import {AccountList} from '../components/AccountList.tsx'

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
  )
}
