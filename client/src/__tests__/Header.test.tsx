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
    // MEMO: getByRole SignIn前なので存在しない
    expect(screen.queryByRole('link', { name: 'MyBooks' })).toBeNull()
    // MEMO: getByTestId SignIn前なので存在しない
    expect(screen.queryByTestId('my-books-link')).toBeNull()
  })
})
