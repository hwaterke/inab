import {graphql} from '../../gql'
import {useQuery} from '@apollo/client'
import {useMemo} from 'react'
import Select from 'react-select'
import {amountFormatter} from '../../utils/formatter.ts'

const allCreditsMissingReimbursementQueryDocument = graphql(`
  query creditTransactionItemsMissingReimbursement {
    creditTransactionItemsMissingReimbursement {
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
  value: string | null
  onChange: (value: string | null) => void
}

export const CreditBankTransactionItemSelect = ({value, onChange}: Props) => {
  const {data} = useQuery(allCreditsMissingReimbursementQueryDocument, {
    fetchPolicy: 'cache-and-network',
  })

  const itemOptions = useMemo(
    () =>
      data?.creditTransactionItemsMissingReimbursement.map((item) => ({
        value: item.uuid,
        label: `${item.transaction.date} ${amountFormatter.format(
          item.amount / 100
        )} ${item.category?.name}`,
      })) ?? [],

    [data]
  )

  return (
    <Select
      options={itemOptions}
      value={itemOptions.find((option) => option.value === value)}
      onChange={(option) => onChange(option?.value ?? null)}
    />
  )
}
