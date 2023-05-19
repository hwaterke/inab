import {PrimaryButtonClassnames} from '../tailwind-utils.ts'
import {Fragment, useState} from 'react'
import {graphql} from '../gql'
import {AlertModal} from '../components/AlertModal.tsx'
import {useMutation, useQuery} from '@apollo/client'
import {MenuOptions} from '../components/MenuOptions.tsx'
import {CategoryGroupModalForm} from '../components/CategoryGroupModalForm.tsx'
import {CategoryModalForm} from '../components/CategoryModalForm.tsx'

const allCategoryGroupsQueryDocument = graphql(`
  query categoryGroups {
    categoryGroups {
      uuid
      name
      categories {
        uuid
        name
      }
    }
  }
`)

const createCategoryGroupMutationDocument = graphql(`
  mutation createCategoryGroup($name: String!) {
    createCategoryGroup(name: $name) {
      uuid
    }
  }
`)

const updateCategoryGroupMutationDocument = graphql(`
  mutation updateCategoryGroup($uuid: ID!, $name: String!) {
    updateCategoryGroup(uuid: $uuid, name: $name) {
      uuid
    }
  }
`)

const deleteCategoryGroupMutationDocument = graphql(`
  mutation deleteCategoryGroup($uuid: ID!) {
    deleteCategoryGroup(uuid: $uuid)
  }
`)

const createCategoryMutationDocument = graphql(`
  mutation createCategory($name: String!, $groupUuid: ID!) {
    createCategory(name: $name, categoryGroupUuid: $groupUuid) {
      uuid
    }
  }
`)

const updateCategoryMutationDocument = graphql(`
  mutation updateCategory($uuid: ID!, $name: String!, $groupUuid: ID!) {
    updateCategory(uuid: $uuid, name: $name, categoryGroupUuid: $groupUuid) {
      uuid
    }
  }
`)

const deleteCategoryMutationDocument = graphql(`
  mutation deleteCategory($uuid: ID!) {
    deleteCategory(uuid: $uuid)
  }
`)

export const Categories = () => {
  const {data} = useQuery(allCategoryGroupsQueryDocument)

  const [createCategoryGroup] = useMutation(
    createCategoryGroupMutationDocument,
    {
      refetchQueries: ['categoryGroups'],
    }
  )
  const [updateCategoryGroup] = useMutation(
    updateCategoryGroupMutationDocument,
    {
      refetchQueries: ['categoryGroups'],
    }
  )
  const [deleteCategoryGroup] = useMutation(
    deleteCategoryGroupMutationDocument,
    {
      refetchQueries: ['categoryGroups'],
    }
  )
  const [createCategory] = useMutation(createCategoryMutationDocument, {
    refetchQueries: ['categoryGroups'],
  })
  const [updateCategory] = useMutation(updateCategoryMutationDocument, {
    refetchQueries: ['categoryGroups'],
  })
  const [deleteCategory] = useMutation(deleteCategoryMutationDocument, {
    refetchQueries: ['categoryGroups'],
  })

  const [editingGroupUuid, setEditingGroupUuid] = useState<string | null>(null)
  const [editingCategoryUuid, setEditingCategoryUuid] = useState<{
    uuid: string
    groupUuid: string
  } | null>(null)

  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'group' | 'category'
    uuid: string
  } | null>(null)

  return (
    <>
      {confirmDelete !== null && (
        <AlertModal
          isOpen
          close={() => setConfirmDelete(null)}
          title={`Delete ${
            confirmDelete.type === 'group'
              ? data?.categoryGroups.find(
                  (account) => account.uuid === confirmDelete.uuid
                )?.name
              : data?.categoryGroups
                  .flatMap((group) => group.categories)
                  .find((account) => account.uuid === confirmDelete.uuid)?.name
          }?`}
          description={`Are you sure you want to delete this category? This action cannot be undone.`}
          confirmButtonText={`Delete`}
          onConfirm={() => {
            if (confirmDelete?.type === 'group') {
              return deleteCategoryGroup({
                variables: {uuid: confirmDelete.uuid},
              })
            } else {
              return deleteCategory({variables: {uuid: confirmDelete.uuid}})
            }
          }}
        />
      )}

      {editingGroupUuid !== null && (
        <CategoryGroupModalForm
          onSubmit={(data) => {
            if (editingGroupUuid === 'new') {
              return createCategoryGroup({variables: data})
            } else {
              return updateCategoryGroup({
                variables: {...data, uuid: editingGroupUuid},
              })
            }
          }}
          isOpen
          close={() => setEditingGroupUuid(null)}
          defaultValues={
            editingGroupUuid === 'new'
              ? undefined
              : data?.categoryGroups.find(
                  (group) => group.uuid === editingGroupUuid
                )
          }
        />
      )}

      {editingCategoryUuid !== null && (
        <CategoryModalForm
          onSubmit={(data) => {
            if (editingCategoryUuid.uuid === 'new') {
              return createCategory({
                variables: {...data, groupUuid: editingCategoryUuid.groupUuid},
              })
            } else {
              return updateCategory({
                variables: {
                  ...data,
                  groupUuid: editingCategoryUuid?.groupUuid,
                  uuid: editingCategoryUuid.uuid,
                },
              })
            }
          }}
          isOpen
          close={() => setEditingCategoryUuid(null)}
          defaultValues={
            editingCategoryUuid.uuid === 'new'
              ? undefined
              : data?.categoryGroups
                  .flatMap((group) => group.categories)
                  .find(
                    (category) => category.uuid === editingCategoryUuid.uuid
                  )
          }
        />
      )}

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <h1 className="text-2xl font-bold leading-7 text-gray-900">
              Categories
            </h1>

            <button
              type="button"
              onClick={() => setEditingGroupUuid('new')}
              className={PrimaryButtonClassnames}
            >
              Add group
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg ring-1 ring-slate-900/10 px-4 py-12 sm:px-6 lg:px-8">
            {data && (
              <ul role="list" className="divide-y divide-gray-100">
                {data.categoryGroups.map((group) => (
                  <Fragment key={group.uuid}>
                    <li className="flex justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200">
                      {group.name}

                      <div className="flex items-center gap-x-6">
                        <MenuOptions
                          options={[
                            {
                              label: 'Add category',
                              onClick: () =>
                                setEditingCategoryUuid({
                                  uuid: 'new',
                                  groupUuid: group.uuid,
                                }),
                            },
                            {
                              label: 'Edit',
                              onClick: () => setEditingGroupUuid(group.uuid),
                            },
                            {
                              label: 'Delete',
                              onClick: () =>
                                setConfirmDelete({
                                  type: 'group',
                                  uuid: group.uuid,
                                }),
                            },
                          ]}
                        />
                      </div>
                    </li>
                    {group.categories.map((category) => (
                      <li
                        key={category.uuid}
                        className="flex justify-between pl-6 pr-4 py-2 hover:bg-gray-200"
                      >
                        {category.name}

                        <div className="flex items-center gap-x-6">
                          <MenuOptions
                            options={[
                              {
                                label: 'Edit',
                                onClick: () =>
                                  setEditingCategoryUuid({
                                    uuid: category.uuid,
                                    groupUuid: group.uuid,
                                  }),
                              },
                              {
                                label: 'Delete',
                                onClick: () =>
                                  setConfirmDelete({
                                    type: 'category',
                                    uuid: category.uuid,
                                  }),
                              },
                            ]}
                          />
                        </div>
                      </li>
                    ))}
                  </Fragment>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
