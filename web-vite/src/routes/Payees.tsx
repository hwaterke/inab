import {graphql} from '../gql'
import {useMutation, useQuery} from '@apollo/client'
import {PrimaryButtonClassnames} from '../tailwind-utils.ts'
import {useState} from 'react'
import {PayeeList} from '../components/PayeeList.tsx'
import {AlertModal} from '../components/AlertModal.tsx'
import {PayeeModalForm} from '../components/PayeeModalForm.tsx'

const allPayeesQueryDocument = graphql(`
  query payees {
    payees {
      uuid
      name
    }
  }
`)

const createPayeeMutationDocument = graphql(`
  mutation createPayee($name: String!) {
    createPayee(name: $name) {
      uuid
    }
  }
`)

const updatePayeeMutationDocument = graphql(`
  mutation updatePayee($uuid: ID!, $name: String!) {
    updatePayee(uuid: $uuid, name: $name) {
      uuid
    }
  }
`)

const deletePayeeMutationDocument = graphql(`
  mutation deletePayee($uuid: ID!) {
    deletePayee(uuid: $uuid)
  }
`)

export const Payees = () => {
  const [editingUuid, setEditingUuid] = useState<string | null>(null)
  const [confirmDeleteUuid, setConfirmDeleteUuid] = useState<string | null>(
    null
  )

  const {data} = useQuery(allPayeesQueryDocument)
  const [createPayee] = useMutation(createPayeeMutationDocument, {
    refetchQueries: ['payees'],
  })
  const [updatePayee] = useMutation(updatePayeeMutationDocument, {
    refetchQueries: ['payees'],
  })
  const [deletePayee] = useMutation(deletePayeeMutationDocument, {
    refetchQueries: ['payees'],
  })

  return (
    <>
      {confirmDeleteUuid !== null && (
        <AlertModal
          isOpen
          close={() => setConfirmDeleteUuid(null)}
          title={`Delete account ${
            data?.payees.find((payee) => payee.uuid === confirmDeleteUuid)?.name
          }?`}
          description={`Are you sure you want to delete this payee? This action cannot be undone.`}
          confirmButtonText={`Delete`}
          onConfirm={() => {
            if (confirmDeleteUuid !== null) {
              return deletePayee({variables: {uuid: confirmDeleteUuid}})
            }
          }}
        />
      )}

      {editingUuid !== null && (
        <PayeeModalForm
          onSubmit={(data) => {
            if (editingUuid === 'new') {
              return createPayee({variables: data})
            } else {
              return updatePayee({variables: {...data, uuid: editingUuid}})
            }
          }}
          isOpen
          close={() => setEditingUuid(null)}
          defaultValues={
            editingUuid === 'new'
              ? undefined
              : data?.payees.find((payee) => payee.uuid === editingUuid)
          }
        />
      )}

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <h1 className="text-2xl font-bold leading-7 text-gray-900">
              Payees
            </h1>

            <button
              type="button"
              onClick={() => setEditingUuid('new')}
              className={PrimaryButtonClassnames}
            >
              Add payee
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg ring-1 ring-slate-900/10 px-4 py-12 sm:px-6 lg:px-8">
            {data && (
              <PayeeList
                payees={data.payees}
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
