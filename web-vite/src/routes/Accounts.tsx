import {graphql} from '../gql'
import {useQuery} from '@apollo/client'
import {useTitle} from '../utils/useTitle.ts'

const allAccountsQueryDocument = graphql(`
  query accounts {
    accounts {
      uuid
      name
    }
  }
`)

export const Accounts = () => {
  useTitle('Accounts')
  const {data} = useQuery(allAccountsQueryDocument)

  return (
    <div>
      {data && (
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
        >
          {data.accounts.map((account) => (
            <li
              key={account.uuid}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                {account.name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
