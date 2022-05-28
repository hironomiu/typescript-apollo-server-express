import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, gql, useLazyQuery } from '@apollo/client'
// import SignIn from './SignIn'
import SignOut from './SignOut'
import { useReactiveVar } from '@apollo/client'
import { isSignInVar, booksVar, userVar } from '../global'

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
      author
    }
  }
`
export const SignInMutation = gql`
  mutation SignInMutation($email: String, $password: String) {
    signIn(email: $email, password: $password) {
      isSuccess
      message
      nickname
    }
  }
`
export const SignOutMutation = gql`
  mutation {
    signOut {
      isSuccess
      message
    }
  }
`
export const AuthCheck = gql`
  query {
    authCheck {
      isSuccess
      message
      nickname
    }
  }
`

const Main = () => {
  const navigate = useNavigate()
  const isSignIn = useReactiveVar(isSignInVar)
  const books = useReactiveVar(booksVar)

  const [, bookLazyQueryState] = useLazyQuery(BOOKS_QUERY, {
    onCompleted: (data) => {
      // console.log('data:', data)
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
        {/* TODO: 型 */}
        {books
          ? books.map((d: any) => (
              <div key={d.id}>
                タイトル：{d.title}：著者：{d.author}
              </div>
            ))
          : null}
      </div>

      {isSignIn ? <SignOut signOut={signOut} /> : null}
    </div>
  )
}

export default Main
