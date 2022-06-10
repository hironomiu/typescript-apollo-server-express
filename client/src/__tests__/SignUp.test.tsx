import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import SignUp from '../components/SignUp'

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
  cache: new InMemoryCache(),
})

describe('SignUp', () => {
  it('test', () => {
    render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </ApolloProvider>
    )
    expect(screen.getByText(/SignUp/i)).toBeInTheDocument()
  })
})
