import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, gql, useLazyQuery } from '@apollo/client'
// import SignIn from './SignIn'
import SignOut from './SignOut'
import { useReactiveVar } from '@apollo/client'
import { isSignInVar } from '../global'

export type Maybe<T> = T | null

export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Book = {
  __typename?: 'Book'
  id?: Maybe<Scalars['Int']>
  title?: Maybe<Scalars['String']>
  author?: Maybe<Scalars['String']>
}

// TODO: 全部別に切り出す
const BOOKS_QUERY = gql`
  query {
    books {
      id
      title
    }
  }
`
export const SignInMutation = gql`
  mutation SignInMutation($email: String, $password: String) {
    signIn(email: $email, password: $password) {
      isSuccess
      message
    }
  }
`
const SignOutMutation = gql`
  mutation {
    signOut {
      isSuccess
      message
    }
  }
`
const AuthCheck = gql`
  query {
    authCheck {
      isSuccess
      message
    }
  }
`

const Main = () => {
  const navigate = useNavigate()

  const isSignIn = useReactiveVar(isSignInVar)

  const [books, setBooks] = useState<[]>()
  const [, bookLazyQueryState] = useLazyQuery(BOOKS_QUERY, {
    onCompleted: (data) => {
      console.log('data:', data)
      setBooks(data.books)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const [authCheck] = useLazyQuery(AuthCheck, {
    onCompleted: (data) => {
      console.log('data:', data)
      if (data.authCheck.isSuccess) {
        console.log('success')
        isSignInVar(true)
      }
    },
  })
  const [signOut] = useMutation(SignOutMutation, {
    onCompleted: () => {
      setBooks((_prev) => (_prev = []))
      isSignInVar(false)
    },
  })

  useEffect(() => {
    authCheck()
  }, [authCheck])

  useEffect(() => {
    if (isSignIn) {
      console.log('books read')
      bookLazyQueryState.refetch().then((data) => setBooks(data.data.books))
    } else {
      navigate('/signin')
    }
  }, [isSignIn, bookLazyQueryState, navigate])

  return (
    <div className="flex flex-col my-4">
      <div className="my-4">
        {books ? books.map((d: any) => <div key={d.id}>{d.title}</div>) : null}
      </div>

      {isSignIn ? <SignOut signOut={signOut} /> : null}
    </div>
  )
}

export default Main
