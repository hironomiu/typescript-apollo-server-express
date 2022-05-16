import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import Layout from './components/Layout'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="h-[100vh] bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500">
        <Layout />
      </div>
    </ApolloProvider>
  )
}

export default App
