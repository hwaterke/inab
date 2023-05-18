import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {Root} from './routes/Root.tsx'
import {Accounts} from './routes/Accounts.tsx'
import {Home} from './routes/Home.tsx'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import {Transactions} from './routes/Transactions.tsx'
import {Payees} from './routes/Payees.tsx'
import {Categories} from './routes/Categories.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'accounts',
        element: <Accounts />,
      },
      {
        path: 'payees',
        element: <Payees />,
      },
      {
        path: 'categories',
        element: <Categories />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
      },
    ],
  },
])

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
})

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  )
}
