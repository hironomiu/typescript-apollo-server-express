import { render, screen } from '@testing-library/react'
import Header from '../components/Header'
import { BrowserRouter } from 'react-router-dom'

describe('Header', () => {
  it('test', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    // MEMO: getByRole
    expect(screen.getByRole('link', { name: 'MyBooks' })).toBeInTheDocument()
    // MEMO: getByTestId
    expect(screen.getByTestId('my-books-link')).toBeInTheDocument()
  })
})
