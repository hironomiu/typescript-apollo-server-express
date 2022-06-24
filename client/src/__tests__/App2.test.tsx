import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { handler } from '../mock/handler'
import App from '../App'

const server = setupServer(...handler)

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})

// TODO: App.test.tsxでCleanUpがうまくいかないので別ファイルで一旦作成
describe('App', () => {
  it('email & passwordを入力しSignInする', async () => {
    render(<App />)
    userEvent.type(screen.getByTestId('email-input'), 'taro@example.com')
    userEvent.type(screen.getByTestId('password-input'), 'password')
    userEvent.click(screen.getByRole('button', { name: 'SignIn' }))
    expect(await screen.findByText(':taro')).toBeInTheDocument()
    userEvent.click(screen.getByRole('button', { name: 'SignOut!' }))
    userEvent.click(screen.getByTestId('signout-modal-signout-button'))
  })
})
