import classNames from 'classnames'

type Props = {
  isIncome: boolean
  category: {
    name: string
  } | null
  reimburse?: {
    uuid: string
  } | null
}

export const CategoryTag = ({isIncome, category, reimburse}: Props) => {
  if (!isIncome && !category && !reimburse) {
    return null
  }

  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
        {'bg-green-50 text-green-700 ring-green-600/20': isIncome},
        {'bg-purple-50 text-purple-700 ring-purple-600/20': reimburse},
        {'bg-blue-50 text-blue-700 ring-blue-600/20': category?.name}
      )}
    >
      {isIncome ? 'Income' : reimburse ? 'Reimbursement' : category?.name}
    </span>
  )
}
