import { render, screen } from '@testing-library/react'
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
})

afterAll(() => {
  server.close()
})

describe('App', () => {
  it('renders learn react link', async () => {
    render(<App />)
    expect(await screen.findByText(/Header/i)).toBeInTheDocument()
    const linkElement = screen.getByText(/SignIn/i)
    expect(linkElement).toBeInTheDocument()
    userEvent.click(screen.getByTestId('change-to-signup'))
    expect(await screen.findByText(/SignUp/i)).toBeInTheDocument()
    userEvent.click(screen.getByTestId('change-to-signin'))
    expect(await screen.findByText(/SignIn/i)).toBeInTheDocument()
    userEvent.click(screen.getByTestId('signin'))
    expect(await screen.findByText(':taro')).toBeInTheDocument()
    expect(
      await screen.findByText('タイトル：テストタイトル１：著者：テスト著者１')
    ).toBeInTheDocument()
  })
})
