import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('App', () => {
  it('renders learn react link', async () => {
    render(<App />)
    expect(await screen.findByText(/Header/i)).toBeInTheDocument()
    const linkElement = screen.getByText(/SignIn/i)
    expect(linkElement).toBeInTheDocument()
    userEvent.click(screen.getByTestId('to-signup'))
    expect(await screen.findByText(/SignUp/i)).toBeInTheDocument()
    userEvent.click(screen.getByTestId('to-signin'))
    expect(await screen.findByText(/SignIn/i)).toBeInTheDocument()
  })
})
