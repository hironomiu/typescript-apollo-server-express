import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReactiveVar, useQuery } from '@apollo/client'
import { MY_BOOKS_QUERY } from '../queries/queries'
import { isSignInVar } from '../global'
const MyBooks = () => {
  const isSignIn = useReactiveVar(isSignInVar)
  const navigate = useNavigate()
  const myBooksQueryState = useQuery(MY_BOOKS_QUERY, {
    variables: {
      id: 0,
      limit: 5,
      offset: 0,
    },
    onCompleted: (data) => {
      console.log('myBooks', data)
    },
  })

  useEffect(() => {
    if (!isSignIn) {
      navigate('/signin')
    }
  }, [isSignIn, navigate])
  return <div className="flex flex-col my-4 items-center">MyBooks</div>
}

export default MyBooks
