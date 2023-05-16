import {graphql} from '../gql'
import {useQuery} from '@apollo/client'
import {useTitle} from '../utils/useTitle.ts'

const allTransactionsQueryDocument = graphql(`
  query transactions {
    transactions {
      uuid
      date
      time
      amount
      bankAccount {
        uuid
        name
      }
      category {
        uuid
        name
      }
      payee {
        uuid
        name
      }
    }
  }
`)

export const Transactions = () => {
  useTitle('Transactions')
  const {data} = useQuery(allTransactionsQueryDocument)

  return (
    <div>
      {data && (
        <ul role="list">
          {data.transactions.map((transaction) => (
            <li key={transaction.uuid} className="border p-2">
              <pre>{JSON.stringify(transaction)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
