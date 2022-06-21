import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import SignUp from '../components/SignUp'
import { client } from '../mock/handler'

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
