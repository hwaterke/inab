import {amountFormatter} from '../utils/formatter.ts'
import classNames from 'classnames'

type Props = {
  amount: number
}

export const AmountBadge = ({amount}: Props) => {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
        {
          'bg-red-100 text-red-700': amount < 0,
          'bg-green-100 text-green-700': amount > 0,
          'bg-gray-100 text-gray-600': amount === 0,
        }
      )}
    >
      {amountFormatter.format(amount / 100)}
    </span>
  )
}
