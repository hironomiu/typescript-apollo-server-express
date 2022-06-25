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

describe('App', () => {
  it('App表示からSignIn、SingUp、SignInに遷移しSignInし表示の確認', async () => {
    render(<App />)
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'SignIn' })).toBeInTheDocument()
    userEvent.click(screen.getByTestId('change-to-signup'))
    expect(
      await screen.findByRole('button', { name: 'SignUp' })
    ).toBeInTheDocument()
    userEvent.click(screen.getByTestId('change-to-signin'))
    expect(
      await screen.findByRole('button', { name: 'SignIn' })
    ).toBeInTheDocument()
    userEvent.click(screen.getByTestId('signin-button'))
    expect(await screen.findByText('taro')).toBeInTheDocument()
    expect(
      await screen.findByText('タイトル：テストタイトル１：著者：テスト著者１')
    ).toBeInTheDocument()
  })
})
