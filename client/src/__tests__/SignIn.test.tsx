import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import SignIn from '../components/SignIn'

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
})

describe('SignIn', () => {
  it('test', () => {
    render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <SignIn />
        </BrowserRouter>
      </ApolloProvider>
    )
    expect(screen.getByText(/SignIn/i)).toBeInTheDocument()
  })
})
