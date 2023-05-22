import {graphql} from '../gql'
import {useQuery} from '@apollo/client'
import {useMemo} from 'react'
import Select from 'react-select'

const allBankTransactionItemsQueryDocument = graphql(`
  query transactionItems {
    transactionItems {
      uuid
      amount
      transaction {
        uuid
        date
        amount
        payee {
          uuid
          name
        }
      }
      category {
        uuid
        name
      }
    }
  }
`)

type Props = {
  value?: string
  onChange: (value?: string) => void
}

export const BankTransactionItemSelect = ({value, onChange}: Props) => {
  const {data} = useQuery(allBankTransactionItemsQueryDocument)

  console.log({data})

  const itemOptions = useMemo(
    () =>
      data?.transactionItems.map((item) => ({
        value: item.uuid,
        label: `${item.transaction.date} ${item.amount} ${item.category.name}`,
      })) ?? [],

    [data]
  )

  return (
    <Select
      options={itemOptions}
      value={itemOptions.find((option) => option.value === value)}
      onChange={(option) => onChange(option?.value)}
    />
  )
}
