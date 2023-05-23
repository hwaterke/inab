import {graphql} from '../../gql'
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
  value: string | null
  onChange: (value?: string) => void
  withIncome?: boolean
  withReimbursement?: boolean
}

type Option = {
  value: string
  label: string
}

export const CategorySelect = ({
  value,
  onChange,
  withIncome,
  withReimbursement,
}: Props) => {
  const {data} = useQuery(allCategoriesQueryDocument)

  const categoryOptions = useMemo(() => {
    const options: Option[] = []

    if (withIncome) {
      options.push({
        value: 'income',
        label: 'Income',
      })
    }

    if (withReimbursement) {
      options.push({
        value: 'reimbursement',
        label: 'Reimbursement',
      })
    }

    if (data?.categories) {
      options.push(
        ...data.categories.map((category) => ({
          value: category.uuid,
          label: category.name,
        }))
      )
    }

    return options
  }, [data, withIncome, withReimbursement])

  return (
    <Select
      options={categoryOptions}
      value={categoryOptions.find((option) => option.value === value)}
      onChange={(option) => onChange(option?.value)}
    />
  )
}
