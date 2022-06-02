import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { useReactiveVar } from '@apollo/client'
import { isSignInVar, booksVar, isBookModalOnVar, bookVar } from '../global'
import { Book } from '../types'
import { BOOKS_QUERY, CREATE_BOOK_MUTATION } from '../queries/queries'
import BookModal from './modal/BookModal'

const Main = () => {
  const navigate = useNavigate()
  const isSignIn = useReactiveVar(isSignInVar)
  const books = useReactiveVar(booksVar)
  const isBookModalOn = useReactiveVar(isBookModalOnVar)

  // TODO: Mutationで渡すBook（一旦実装）
  const [book, setBook] = useState<Book>({})

  const bookLazyQueryState = useQuery(BOOKS_QUERY, {
    // TODO: ページネーションの実装。値は仮で設定
    variables: {
      limit: 3,
      offset: 0,
    },
    onCompleted: (data) => {
      booksVar(data.books)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  // TODO: 仮で実装
  const [createBook] = useMutation(CREATE_BOOK_MUTATION, {
    variables: {
      title: book.title,
      author: book.author,
    },
    onCompleted: (data) => {
      console.log(data)
    },
  })

  useEffect(() => {
    if (isSignIn) {
      bookLazyQueryState.refetch().then((data) => booksVar(data.data.books))
    } else {
      navigate('/signin')
    }
  }, [isSignIn, bookLazyQueryState, navigate])

  const handleClick = (book: Book) => {
    bookVar(book)
    isBookModalOnVar(true)
  }

  return (
    <div className="flex flex-col my-4 items-center">
      <div className="my-4">
        {books
          ? books.map((book: Book) => (
              <div key={book.id} onClick={() => handleClick(book)}>
                タイトル：{book.title}：著者：{book.author}
              </div>
            ))
          : null}
      </div>
      <input
        type="text"
        value={book.title || ''}
        onChange={(e) =>
          setBook((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      <input
        type="text"
        value={book.author || ''}
        onChange={(e) =>
          setBook((prev) => ({ ...prev, author: e.target.value }))
        }
      />
      <button
        onClick={(e) => {
          e.preventDefault()
          createBook()
          setBook({})
        }}
      >
        登録
      </button>
      {isBookModalOn ? <BookModal /> : null}
    </div>
  )
}

export default Main
