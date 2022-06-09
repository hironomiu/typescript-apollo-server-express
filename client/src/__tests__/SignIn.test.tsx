import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import SignIn from '../components/SignIn'

// TODO: MSWに切り替える
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
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
