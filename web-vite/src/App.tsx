import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {Root} from './routes/Root.tsx'
import {Accounts} from './routes/Accounts.tsx'
import {Home} from './routes/Home.tsx'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'

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
