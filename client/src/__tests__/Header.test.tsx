import { render, screen } from '@testing-library/react'
import Header from '../components/Header'

describe('Header', () => {
  it('test', () => {
    render(<Header />)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })
})
