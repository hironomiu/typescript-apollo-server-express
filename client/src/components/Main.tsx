import { useEffect, useState } from 'react'
import { useMutation, gql, useLazyQuery } from '@apollo/client'

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

const BOOKS_QUERY = gql`
  query {
    books {
      id
      title
    }
  }
`
const SignInMutation = gql`
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
  const [email, setEmail] = useState('taro@example.com')
  const [password, setPassword] = useState('password')
  const [isSignIn, setIsSignIn] = useState(false)
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
        setIsSignIn(true)
      }
    },
  })
  const [signOut] = useMutation(SignOutMutation, {
    onCompleted: () => {
      setBooks((_prev) => (_prev = []))
      setIsSignIn(false)
    },
  })
  const [signIn] = useMutation(SignInMutation, {
    variables: {
      email: email,
      password: password,
    },
    onCompleted: (data) => {
      console.log(data)
      if (data.signIn.isSuccess) {
        console.log('success')
        setIsSignIn(true)
      }
    },
  })

  useEffect(() => {
    authCheck()
  }, [authCheck])

  useEffect(() => {
    console.log('isSignin:', isSignIn)
    if (isSignIn) {
      console.log('books read')
      bookLazyQueryState.refetch().then((data) => setBooks(data.data.books))
    }
  }, [isSignIn, bookLazyQueryState])

  return (
    <div className="flex flex-col my-4">
      {isSignIn ? (
        <span className="text-4xl">ログインしとるで！</span>
      ) : (
        <span className="text-4xl">ログインしてもええんやで！</span>
      )}
      <div className="my-4">
        {books ? books.map((d: any) => <div key={d.id}>{d.title}</div>) : null}
      </div>

      {isSignIn ? null : (
        <SignIn
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          signIn={signIn}
        />
      )}

      {isSignIn ? <SignOut signOut={signOut} /> : null}
    </div>
  )
}

const SignIn = ({ email, setEmail, password, setPassword, signIn }: any) => {
  return (
    <div className="flex flex-col my-4 items-center">
      <div>
        <div className="justify-start">
          <label className="mr-2">
            Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </label>
          <input
            className="h-8 px-2"
            type="text"
            value={email}
            onChange={(e) => setEmail((_prev: any) => (_prev = e.target.value))}
          />
        </div>
        <div className="items-start my-2">
          <label className="mr-2">Password</label>
          <input
            className="h-8 px-2"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword((_prev: any) => (_prev = e.target.value))
            }
          />
        </div>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault()
          signIn()
        }}
        className="text-2xl"
      >
        SignIn
      </button>
    </div>
  )
}

const SignOut = ({ signOut }: any) => {
  return (
    <div className="my-4 flex justify-center">
      <button
        onClick={(e) => {
          e.preventDefault()
          signOut()
        }}
        className="text-2xl"
      >
        SignOut
      </button>
    </div>
  )
}
export default Main
