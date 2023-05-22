import {graphql} from '../gql'
import {useQuery} from '@apollo/client'
import {useMemo} from 'react'
import Select from 'react-select'

const allCategoriesQueryDocument = graphql(`
  query categories {
    categories {
      uuid
      name
    }
  }
`)

type Props = {
  value: string
  onChange: (value?: string) => void
}

type Option = {
  value: string
  label: string
}

export const CategorySelect = ({value, onChange}: Props) => {
  const {data} = useQuery(allCategoriesQueryDocument)

  const categoryOptions: Option[] = useMemo(
    () =>
      data?.categories.map((category) => ({
        value: category.uuid,
        label: category.name,
      })) ?? [],

    [data]
  )

  return (
    <Select
      options={categoryOptions}
      value={categoryOptions.find((option) => option.value === value)}
      onChange={(option) => onChange(option?.value)}
    />
  )
}
