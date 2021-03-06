import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReactiveVar, useQuery } from '@apollo/client'
import { MY_BOOKS_QUERY } from '../queries/queries'
import { isSignInVar, myBooksVar } from '../global'
const MyBooks = () => {
  const isSignIn = useReactiveVar(isSignInVar)
  const myBooks = useReactiveVar(myBooksVar)
  const navigate = useNavigate()
  const myBooksQueryState = useQuery(MY_BOOKS_QUERY, {
    variables: {
      limit: 3,
      offset: 0,
    },
    onCompleted: (data) => {
      console.log('myBooks', data)
      myBooksVar(data.myBooks)
    },
  })

  useEffect(() => {
    if (!isSignIn) {
      navigate('/signin')
    } else {
      myBooksQueryState
        .refetch()
        .then((data: any) => myBooksVar(data.data.myBooks))
    }
  }, [isSignIn, navigate, myBooksQueryState])
  return (
    <div className="flex flex-col my-4 items-center">
      {myBooks
        ? myBooks.edges.map((myBook: any, index: number) => (
            <div key={index}>
              {myBook.books.title}:{myBook.books.author}:{myBook.comment}
            </div>
          ))
        : null}
    </div>
  )
}

export default MyBooks
