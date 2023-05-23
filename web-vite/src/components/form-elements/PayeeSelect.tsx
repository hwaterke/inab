import {useQuery} from '@apollo/client'
import {useMemo} from 'react'
import Select, {Props as SelectProps} from 'react-select'
import {allPayeesQueryDocument} from '../../routes/Payees.tsx'

type Option = {
  value: string
  label: string
}

type Props = {
  value: string | null
  onChange: (value: string | null) => void
} & Omit<SelectProps<Option, false>, 'value' | 'onChange'>

export const PayeeSelect = ({value, onChange, ...rest}: Props) => {
  const {data} = useQuery(allPayeesQueryDocument)

  const options = useMemo(
    () =>
      data?.payees.map((payee) => ({
        value: payee.uuid,
        label: payee.name,
      })) ?? [],

    [data]
  )

  return (
    <Select
      options={options}
      value={options.find((option) => option.value === value)}
      onChange={(option) => onChange(option?.value ?? null)}
      isClearable
      {...rest}
    />
  )
}
