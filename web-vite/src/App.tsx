import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {Root} from './routes/Root.tsx'
import {Accounts} from './routes/Accounts.tsx'
import {Home} from './routes/Home.tsx'
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client'
import {Transactions} from './routes/Transactions.tsx'
import {Payees} from './routes/Payees.tsx'
import {Categories} from './routes/Categories.tsx'
import {typePolicies} from './typePolicies.ts'
import {PropsWithChildren, useMemo} from 'react'
import createCache from '@emotion/cache'
import {CacheProvider} from '@emotion/react'

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
  cache: new InMemoryCache({
    typePolicies,
  }),
})

// This ensures that Emotion's styles are inserted before Tailwind's styles so that Tailwind classes have precedence over Emotion
const EmotionCacheProvider = ({children}: PropsWithChildren<object>) => {
  const cache = useMemo(
    () =>
      createCache({
        key: 'with-tailwind',
        insertionPoint: document.querySelector('title')!,
      }),
    []
  )

  return <CacheProvider value={cache}>{children}</CacheProvider>
}

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <EmotionCacheProvider>
        <RouterProvider router={router} />
      </EmotionCacheProvider>
    </ApolloProvider>
  )
}
