import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useLazyQuery } from '@apollo/client'
import SignOut from './SignOut'
import { useReactiveVar } from '@apollo/client'
import { isSignInVar, booksVar, userVar } from '../global'
import { Book } from '../types'
import { BOOKS_QUERY, SignOutMutation, BookCreate } from '../queries/queries'

const Main = () => {
  const navigate = useNavigate()
  const isSignIn = useReactiveVar(isSignInVar)
  const books = useReactiveVar(booksVar)

  // TODO: Mutationで渡すBook（一旦実装）
  const [book, setBook] = useState<Book>({})

  const [, bookLazyQueryState] = useLazyQuery(BOOKS_QUERY, {
    onCompleted: (data) => {
      booksVar(data.books)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const [signOut] = useMutation(SignOutMutation, {
    onCompleted: () => {
      booksVar([])
      userVar({ nickname: '' })
      isSignInVar(false)
    },
  })

  // TODO: 仮で実装（命名についても要検討）
  const [bookCreate] = useMutation(BookCreate, {
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

  return (
    <div className="flex flex-col my-4 items-center">
      <div className="my-4">
        {books
          ? books.map((book: Book) => (
              <div key={book.id}>
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
          bookCreate()
          setBook({})
        }}
      >
        登録
      </button>
      {isSignIn ? <SignOut signOut={signOut} /> : null}
    </div>
  )
}

export default Main
