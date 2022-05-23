import React from 'react'
import { useReactiveVar, useMutation } from '@apollo/client'
import { isSignInVar, booksVar } from '../global'
import { SignOutMutation } from './Main'

const Header = () => {
  const books = useReactiveVar(booksVar)
  const [signOut] = useMutation(SignOutMutation, {
    onCompleted: () => {
      booksVar([])
      isSignInVar(false)
    },
  })
  const isSignIn = useReactiveVar(isSignInVar)
  return (
    <header className="flex ">
      <nav className="flex">
        <div>Header</div>
        {isSignIn ? 'SignIned' : null}
      </nav>
    </header>
  )
}

export default Header
