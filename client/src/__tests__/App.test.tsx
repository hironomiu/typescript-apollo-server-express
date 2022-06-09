import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders learn react link', async () => {
    render(<App />)
    expect(await screen.findByText(/Header/i)).toBeInTheDocument()
    const linkElement = screen.getByText(/Header/i)
    expect(linkElement).toBeInTheDocument()
  })
})
