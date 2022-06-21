import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import SignIn from '../components/SignIn'
import { client } from '../mock/handler'

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
