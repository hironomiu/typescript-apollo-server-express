import { render, screen } from '@testing-library/react'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'
import Main from '../components/Main'
import { client, handler } from '../mock/handler'
import { setupServer } from 'msw/node'

const server = setupServer(...handler)

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

describe('Main', () => {
  it('test', async () => {
    render(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </ApolloProvider>
    )
    expect(
      await screen.findByText('タイトル：テストタイトル１：著者：テスト著者１')
    ).toBeInTheDocument()
  })
})
